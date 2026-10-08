<script lang="ts">
  // Khung hộp số minh họa (mảng). Presentational: chỉ render theo props.
  interface Props {
    values: number[];
    /** hộp nào đang mở (true) / đang đóng hiện "?" (false) */
    opened: boolean[];
    clickable: boolean;
    /** index cần tô sáng */
    highlight?: number;
    /** hiện số thứ tự dưới mỗi hộp */
    showIndex?: boolean;
    onPick?: (i: number) => void;
  }
  const { values, opened, clickable, highlight, showIndex = true, onPick }: Props = $props();

  function isOpen(i: number): boolean {
    return opened[i] === true;
  }
</script>

<div class="arr">
  {#each values as v, i (i)}
    <div class="cell">
      {#if clickable}
        <button
          class={'box' + (isOpen(i) ? '' : ' shut') + (highlight === i ? ' hi' : '')}
          onclick={() => onPick?.(i)}
          aria-label={`Hộp ${i}`}
        >
          {isOpen(i) ? v : '?'}
        </button>
      {:else}
        <div class={'box' + (highlight === i ? ' hi' : '')}>{v}</div>
      {/if}
      {#if showIndex}<div class="idx">{i}</div>{/if}
    </div>
  {/each}
</div>
