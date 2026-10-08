<script lang="ts">
  import { ALL_IDS, isUnlocked } from './domain/curriculum';
  import { createDomainPorts } from './domain/domain-ports';
  import { LocalProgressStorage } from './domain/storage';
  import type { ProgressState } from './domain/types';
  import { HealthCheckFlow } from './flows/healthcheck-flow.svelte';
  import { ProbeFlow } from './flows/probe-flow.svelte';
  import { ReviewFlow } from './flows/review-flow.svelte';
  import { RootcheckFlow } from './flows/rootcheck-flow.svelte';
  import HealthCheckScreen from './components/HealthCheckScreen.svelte';
  import LessonRunner from './components/LessonRunner.svelte';
  import ProbeScreen from './components/ProbeScreen.svelte';
  import ReviewScreen from './components/ReviewScreen.svelte';
  import Road from './components/Road.svelte';
  import RootCheckScreen from './components/RootCheckScreen.svelte';

  // Coordinator: giữ storage + ports dùng chung, điều phối các màn hình.
  // Luồng chính: lộ trình -> bài học -> kiểm tra hiểu thật -> bài tiếp theo.
  // Luồng phụ: ôn cách quãng, kiểm tra nền tảng, truy tìm gốc hổng.
  const storage = new LocalProgressStorage();
  const ports = createDomainPorts();

  type View =
    | { name: 'road' }
    | { name: 'lesson'; id: string }
    | { name: 'probe'; flow: ProbeFlow }
    | { name: 'review'; flow: ReviewFlow }
    | { name: 'healthcheck'; flow: HealthCheckFlow }
    | { name: 'rootcheck'; flow: RootcheckFlow };

  let view = $state<View>({ name: 'road' });
  let progress = $state<ProgressState>(storage.load());
  let currentLessonId = $state<string | null>(null);

  const titles = Object.fromEntries(
    Object.entries(ports.lessons).map(([id, l]) => [id, l.t]),
  );
  const totalCount = ALL_IDS.length;
  const doneCount = $derived(Object.keys(progress.done).length);

  function refreshProgress(): void {
    progress = storage.load();
  }

  function goRoad(): void {
    currentLessonId = null;
    refreshProgress();
    view = { name: 'road' };
  }

  function openLesson(id: string): void {
    if (ports.lessons[id] === undefined) return;
    currentLessonId = id;
    refreshProgress();
    view = { name: 'lesson', id };
  }

  function openRootcheck(id: string): void {
    const flow = new RootcheckFlow({
      storage,
      ports,
      lessonId: id,
      onRequestRestart: openLesson,
    });
    view = { name: 'rootcheck', flow };
  }

  /** Bài tiếp theo trong lộ trình (null khi đã hết hoặc chưa mở khóa). */
  function nextLessonId(id: string): string | null {
    const idx = ALL_IDS.indexOf(id);
    const next = idx >= 0 ? ALL_IDS[idx + 1] : undefined;
    if (next === undefined) return null;
    const st = storage.load();
    return isUnlocked(next, st) ? next : null;
  }

  function startProbe(id: string): void {
    const flow = new ProbeFlow({
      storage,
      ports,
      lessonId: id,
      callbacks: {
        onOpenLesson: openLesson,
        onOpenRootcheck: openRootcheck,
        onContinue: (lid) => {
          const next = nextLessonId(lid);
          if (next) openLesson(next);
          else goRoad();
        },
      },
    });
    view = { name: 'probe', flow };
  }

  /** Học xong các bước của bài: đánh dấu done rồi kiểm tra hiểu thật. */
  function completeLessonSteps(id: string): void {
    const st = storage.load();
    st.done[id] = 1;
    storage.save(st);
    if (ports.probeBanks[id] !== undefined) {
      startProbe(id);
    } else {
      // Bài không có bank kiểm tra (vd rd1): xong là qua.
      const next = nextLessonId(id);
      if (next) openLesson(next);
      else goRoad();
    }
  }

  function openReview(): void {
    const flow = new ReviewFlow({
      storage,
      ports,
      callbacks: {
        onOpenLesson: openLesson,
        onOpenRootcheck: openRootcheck,
        onReprove: (id) => {
          startProbe(id);
        },
        onExit: goRoad,
      },
    });
    view = { name: 'review', flow };
  }

  function openHealthCheck(): void {
    const flow = new HealthCheckFlow({
      storage,
      ports,
      callbacks: {
        onOpenLesson: openLesson,
        onOpenRootcheck: openRootcheck,
        onReprove: (id) => {
          startProbe(id);
        },
        onExit: goRoad,
      },
    });
    flow.start();
    view = { name: 'healthcheck', flow };
  }
</script>

<div class="top">
  <h1>DSA từng bước nhỏ</h1>
  <p>Hiểu trước, gõ sau. Mỗi bước thật nhỏ, tự nghĩ rồi mới đi tiếp.</p>
  <label>Tiến độ <progress max={totalCount} value={doneCount}></progress></label>
</div>
<div class="wrap">
  <Road
    stages={ports.stages}
    lessons={ports.lessons}
    {progress}
    isUnlocked={(id: string) => isUnlocked(id, progress)}
    currentId={currentLessonId}
    onSelect={openLesson}
    onReview={openReview}
  />
  <main class="panel">
    {#if view.name === 'road'}
      <h2>Bắt đầu từ đâu?</h2>
      <p>
        Mỗi bậc thang rất thấp: học vài bước, kiểm tra hiểu thật ngay tại
        chỗ, rồi mới bước tiếp. Chọn bài ở bên trái.
      </p>
      <p class="sub">
        Cách học ở đây: dự đoán trước, làm sau, rồi tự rút ra quy luật.
      </p>
    {:else if view.name === 'lesson'}
      {@const lessonId = view.id}
      {@const lesson = ports.lessons[lessonId]}
      {#if lesson}
        {#key lessonId}
          <LessonRunner
            {lesson}
            onDone={() => { completeLessonSteps(lessonId); }}
          />
        {/key}
      {/if}
    {:else if view.name === 'probe'}
      {#key view.flow}
        <ProbeScreen flow={view.flow} lessons={ports.lessons} {titles} />
      {/key}
    {:else if view.name === 'review'}
      <ReviewScreen
        flow={view.flow}
        lessons={ports.lessons}
        {titles}
        onHealthCheck={openHealthCheck}
      />
    {:else if view.name === 'healthcheck'}
      <HealthCheckScreen
        flow={view.flow}
        lessons={ports.lessons}
        {titles}
      />
    {:else if view.name === 'rootcheck'}
      <RootCheckScreen
        flow={view.flow}
        lessons={ports.lessons}
        {titles}
        onExit={goRoad}
      />
    {/if}
  </main>
</div>
