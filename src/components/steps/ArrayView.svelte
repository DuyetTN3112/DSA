<script lang="ts">
  // Khung hộp số minh họa (mảng). Presentational: chỉ render theo props.
  interface Props {
    values: (string | number)[];
    /** hộp nào đang mở (true) / đang đóng hiện "?" (false) */
    opened: boolean[];
    clickable: boolean;
    /** index cần tô sáng */
    highlight?: number | undefined;
    /** hiện số thứ tự dưới mỗi hộp */
    showIndex?: boolean;
    /** nhãn tuỳ ý dưới mỗi hộp (thay cho chỉ số), vd thứ tự đếm ở bước tap */
    labels?: (string | number)[];
    /** hộp nào tô sáng (ngoài highlight) */
    marked?: boolean[];
    onPick?: (i: number) => void;
  }
  const { values, opened, clickable, highlight, showIndex = true, labels, marked, onPick }: Props = $props();

  function isHi(i: number): boolean {
    return highlight === i || marked?.[i] === true;
  }

  function isOpen(i: number): boolean {
    return opened[i] === true;
  }
</script>

<div class="arr">
  {#each values as v, i (i)}
    <div class="cell">
      {#if clickable}
        <button
          class={'box' + (isOpen(i) ? '' : ' shut') + (isHi(i) ? ' hi' : '')}
          onclick={() => onPick?.(i)}
          aria-label={`Hộp ${i}`}
        >
          {isOpen(i) ? v : '?'}
        </button>
      {:else}
        <div class={'box' + (isHi(i) ? ' hi' : '')}>{v}</div>
      {/if}
      {#if labels}<div class="idx">{labels[i] ?? ''}</div>{:else if showIndex}<div class="idx">{i}</div>{/if}
    </div>
  {/each}
</div>
