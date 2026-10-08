<script lang="ts">
  // Hồ sơ học: chỉ render số liệu đã tổng hợp. Mọi tính toán (ai vững,
  // hộp Leitner, breakdown...) do flow cha làm rồi truyền vào.
  export interface LabeledCount {
    label: string;
    count: number;
  }
  export interface TitledCount {
    id: string;
    title: string;
    count: number;
  }
  export interface ReviewStats {
    totalLessons: number;
    doneCount: number;
    /** qua ở ≥2 ngày khác nhau */
    stableCount: number;
    unstableCount: number;
    /** id các bài cần chứng minh lại */
    shakyTitles: string[];
    weakLessons: TitledCount[];
    missShapes: LabeledCount[];
    habits: LabeledCount[];
    /** bài hay phải giở sổ tay */
    notebookLessons: TitledCount[];
    assistedCount: number;
    luckyCount: number;
    stuckKinds: LabeledCount[];
    /** số bài ở hộp 1..5 */
    leitnerBoxes: [number, number, number, number, number];
    dueToday: number;
    healthCheckLast: string | null;
    nextStep: string;
  }

  interface Props {
    stats: ReviewStats;
  }
  const { stats }: Props = $props();

  function joinOrNone(items: TitledCount[], suffix: string): string {
    return items.length > 0
      ? items.map((x) => `${x.title} (${x.count}${suffix})`).join('; ')
      : 'chưa có.';
  }
</script>

<h2>Hồ sơ học</h2>
<p class="sub">Không đếm bài đã làm. Đếm điều bạn thật sự chứng minh được.</p>

<p>
  <b>Bài có kiểm tra hiểu thật:</b> đã qua {stats.doneCount}/{stats.totalLessons}.
  Vững (qua ở ≥2 ngày khác nhau): <b>{stats.stableCount}</b>.
  Chưa vững: <b>{stats.unstableCount}</b>.
  Cần chứng minh lại ⚠: <b>{stats.shakyTitles.length}</b>.
</p>
{#if stats.shakyTitles.length > 0}
  <p class="sub">⚠: {stats.shakyTitles.join('; ')}</p>
{/if}
<p>
  <b>Nền tảng yếu (số lần phải học lại):</b>
  {joinOrNone(stats.weakLessons, '')}
</p>
<p>
  <b>Dạng câu hay sai nhất:</b>
  {stats.missShapes.length > 0
    ? stats.missShapes
        .slice(0, 3)
        .map((x) => `${x.label} (${x.count})`)
        .join('; ')
    : 'chưa có dữ liệu.'}
</p>
<p>
  <b>Thói quen cần sửa:</b>
  {stats.habits.length > 0
    ? stats.habits.map((x) => `${x.label} (${x.count})`).join('; ')
    : 'chưa phát hiện.'}
</p>
<p>
  <b>Bài hay phải giở sổ tay (bạn nói thật là chưa hiểu, rất tốt):</b>
  {joinOrNone(stats.notebookLessons, ' lần')}{#if stats.assistedCount > 0}
    Số lần qua kiểm tra nhờ sổ tay: {stats.assistedCount}.{/if}{#if stats.luckyCount > 0}
    Số lần đoán đúng (không tính vào hiểu): {stats.luckyCount}.{/if}
</p>
{#if stats.stuckKinds.length > 0}
  <p>
    <b>Chỗ hay vướng khi bấm «Chưa hiểu»:</b>
    {stats.stuckKinds.map((x) => `${x.label} (${x.count})`).join('; ')}.
  </p>
{/if}
<p>
  <b>Hộp ôn cách quãng</b> (1 đến 5): {stats.leitnerBoxes.join(' / ')}. Đến hạn
  hôm nay: {stats.dueToday}. Kiểm tra nền tảng: {stats.healthCheckLast
    ? 'lần cuối ' + stats.healthCheckLast
    : 'chưa làm lần nào'}.
</p>
<div class="fb ok"><b>Bước tiếp theo:</b> {stats.nextStep}</div>
<p class="sub">
  Dữ liệu chỉ gồm điều app đo được: đúng/sai, độ chắc chắn, thời gian trả lời,
  dạng câu.
</p>
