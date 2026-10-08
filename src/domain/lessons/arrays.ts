import type { RichLesson } from './lesson-types';

export const ARRAYS_LESSONS: RichLesson[] = [
{
    id: "l1",
    t: "Mảng là dãy hộp có số thứ tự",
    steps: [
      {
        k: "click",
        q: "Đây là 4 hộp xếp hàng. Mỗi hộp có một số thứ tự gọi là chỉ số, và máy tính đếm từ 0. Bấm vào hộp đầu tiên.",
        a: 0,
        h: "Hộp đầu tiên mang số thứ tự nào, nếu đếm từ 0?",
        s: "Hộp đầu có chỉ số 0."
      },
      {
        k: "click",
        q: "Bấm vào hộp đang chứa số 9.",
        a: 2,
        h: "Nhìn dòng chữ nhỏ bên dưới mỗi hộp, đó là chỉ số.",
        s: "Số 9 nằm ở chỉ số 2."
      },
      {
        k: "input",
        q: "Hộp có chỉ số 3 chứa số mấy?",
        a: 4,
        h: "Tìm hộp có chữ 3 bên dưới.",
        s: "Chỉ số 3 chứa số 4."
      },
      {
        k: "input",
        q: "Mảng này có 4 hộp. Chỉ số của hộp cuối cùng là mấy?",
        a: 3,
        h: "Hộp đầu là 0. Đếm tiếp: 0, 1, ... đến hộp thứ tư.",
        s: "4 hộp thì chỉ số cuối là 3."
      },
      {
        k: "input",
        q: "Tự khái quát: mảng có 100 hộp thì chỉ số cuối là bao nhiêu?",
        a: 99,
        h: "Quy luật ở câu trước: chỉ số cuối = số hộp trừ đi mấy?",
        s: "Chỉ số cuối = số hộp - 1."
      }
    ],
    arr: [
      7,
      3,
      9,
      4
    ],
    dr: "idx",
    note: "<b>Mảng (list)</b> là một dãy hộp xếp hàng, mỗi hộp có <b>chỉ số</b> bắt đầu từ 0.<pre>a = [7, 8, 9, 4]\n# chỉ số:  0  1  2  3</pre>• Hộp đầu có chỉ số <b>0</b>. Số 9 ở chỉ số 2; chỉ số 3 chứa số 4.<br>• Có n hộp thì các chỉ số là <b>0 đến n - 1</b>. Hộp cuối có chỉ số <b>n - 1</b> (ở ví dụ: 4 hộp, chỉ số cuối là 3).<br>• Chỉ số = số hộp đứng trước nó.<br><b>Mẹo kiểm tra:</b> viết các chỉ số ra giấy. Nếu bạn viết chỉ số bằng số hộp thì đã vượt quá cuối."
  },
{
    id: "l2",
    t: "Tìm một số: mở từng hộp",
    steps: [
      {
        k: "open",
        q: "Các hộp đang đóng kín, mỗi lần chỉ mở được một hộp. Hãy tìm số 9 bằng cách mở hộp (bấm vào hộp). Bạn tự chọn thứ tự.",
        a: 3,
        h: "Nếu mở lung tung, bạn có thể bỏ sót hoặc mở trùng. Có cách mở nào có trật tự không?",
        s: "Đã tìm thấy 9."
      },
      {
        k: "choice",
        q: "Cách mở nào đảm bảo không bỏ sót và không mở trùng?",
        o: ["Từ trái sang phải, từng hộp","Nhảy cóc ngẫu nhiên","Chỉ mở hộp giữa"],
        a: 0,
        h: "Muốn chắc chắn mình đã xét hết thì phải đi có thứ tự.",
        s: "Đi tuần tự, mỗi hộp đúng một lần."
      },
      {
        k: "input",
        q: "Nếu số 9 nằm ở hộp cuối của mảng 5 hộp, bạn phải mở tối đa bao nhiêu hộp?",
        a: 5,
        h: "Mở từ đầu, hộp cuối là hộp thứ mấy?",
        s: "Phải mở cả 5 hộp."
      },
      {
        k: "input",
        q: "Mảng có 1000 hộp, trường hợp xấu nhất phải mở bao nhiêu hộp?",
        a: 1000,
        h: "Cùng quy luật câu trước.",
        s: "Tối đa n hộp. Gọi là tìm tuyến tính, độ phức tạp O(n)."
      }
    ],
    arr: [
      5,
      8,
      2,
      9,
      1
    ],
    hide: true,
    dr: "lin",
    note: "<b>Tìm một số: mở từng hộp</b>, bắt đầu từ hộp chỉ số 0.<br>• Mở hộp i; <b>gặp</b> số cần tìm thì dừng và trả về <b>chỉ số i</b> (không phải chính số đó).<br>• Chỉ khi <b>đã mở hết mọi hộp</b> mà không gặp mới kết luận \"không có\" (thường trả -1).<br>• Có nhiều số giống nhau thì dừng ở lần gặp <b>đầu tiên</b>.<br><b>Lỗi hay gặp:</b> kết luận \"không có\" ngay sau hộp đầu tiên không khớp. Câu \"không có\" chỉ được nói sau khi hết vòng lặp."
  },
{
    id: "l3",
    t: "Tìm số lớn nhất: tờ giấy nhớ",
    steps: [
      {
        k: "choice",
        q: "Bạn có một tờ giấy ghi 'số lớn nhất đã thấy'. Trước khi mở hộp nào, nên ghi gì lên giấy?",
        o: ["Số 0","Số trong hộp đầu tiên","Để trống mãi"],
        a: 1,
        h: "Nếu mảng toàn số âm thì số 0 có đúng không?",
        s: "Lấy hộp đầu làm mốc ban đầu, luôn đúng."
      },
      {
        k: "input",
        q: "Giấy đang ghi 4. Hộp chỉ số 1 chứa 9. Sau khi so sánh, giấy ghi số mấy?",
        a: 9,
        h: "9 có lớn hơn 4 không? Nếu có thì giấy thay đổi.",
        s: "9 lớn hơn nên ghi đè thành 9.",
        hi: 1
      },
      {
        k: "input",
        q: "Giấy ghi 9. Hộp chỉ số 2 chứa 2. Giấy ghi số mấy?",
        a: 9,
        h: "2 có lớn hơn 9 không?",
        s: "2 nhỏ hơn nên giấy giữ nguyên 9.",
        hi: 2
      },
      {
        k: "input",
        q: "Giấy ghi 9. Hộp chỉ số 3 chứa 7. Giấy ghi số mấy?",
        a: 9,
        h: "So sánh 7 với 9.",
        s: "Vẫn là 9.",
        hi: 3
      },
      {
        k: "choice",
        q: "Khi đi tới hộp mới, có cần quay lại nhìn các hộp trước không?",
        o: ["Có, để chắc chắn","Không, tờ giấy đã nhớ giúp"],
        a: 1,
        h: "Tờ giấy lưu thông tin gì về các hộp đã qua?",
        s: "Một lần duyệt là đủ: O(n)."
      },
      {
        k: "reflect",
        q: "Hãy tự viết bằng lời của bạn: thuật toán tìm số lớn nhất gồm những bước nào? (Viết thô cũng được, đây là bước quan trọng nhất.)"
      }
    ],
    arr: [
      4,
      9,
      2,
      7
    ],
    dr: "max",
    note: "<b>Tìm số lớn nhất: tờ giấy nhớ.</b> Ghi số lớn nhất <b>đã thấy cho đến giờ</b> lên tờ giấy.<br>• Bắt đầu: ghi số ở hộp đầu tiên.<br>• Mỗi hộp tiếp theo: nếu số mới <b>lớn hơn</b> số trên giấy thì xóa đi, ghi số mới; nếu không thì giữ nguyên.<br>• Hết hộp: số trên giấy là số lớn nhất.<br><b>Vì sao bắt đầu từ hộp đầu, không phải 0?</b> Nếu mọi số đều âm thì 0 sẽ lớn hơn tất cả và cho kết quả sai."
  },
{
    id: "a2",
    t: "Đọc một hộp: a[i]",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">a = [4, 8, 1]\nprint(a[1])</pre>In ra số mấy?",
        a: 8,
        h: "Chỉ số 1 là hộp thứ mấy, đếm từ 0?",
        s: "a[1] chứa 8."
      },
      {
        k: "input",
        q: "<pre class=\"out\">a = [4, 8, 1]\nprint(a[len(a) - 1])</pre>In ra số mấy?",
        a: 1,
        h: "len(a) là 3. Vậy len(a) - 1 là bao nhiêu?",
        s: "a[2] = 1: hộp cuối."
      },
      {
        k: "choice",
        q: "a[5] khi a chỉ có 3 hộp thì sao?",
        o: ["Báo lỗi IndexError","Trả về 0","Trả về hộp cuối"],
        a: 0,
        h: "Hộp số 5 không tồn tại.",
        s: "Hộp không có thì Python báo IndexError."
      }
    ],
    dr: "get",
    note: "<b>Đọc một hộp: <code>a[i]</code></b> lấy giá trị ở hộp có chỉ số i.<pre>a = [7, 8, 1]\nprint(a[1])   # 8\nprint(a[2])   # 1 (hộp cuối)</pre>• Đếm từ 0: <code>a[0]</code> là hộp đầu.<br>• Hộp cuối là <code>a[len(a) - 1]</code>.<br>• Chỉ số không có hộp (nhỏ hơn 0 hoặc từ <code>len(a)</code> trở lên) thì Python báo <b>IndexError</b>. Đó là cách máy nói \"không có hộp đó\"."
  },
{
    id: "a3",
    t: "Ghi đè một hộp: a[i] = x",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">a = [4, 8, 1]\na[0] = 9\nprint(a[0])</pre>In ra số mấy?",
        a: 9,
        h: "a[0] = 9 là bỏ 9 vào hộp 0.",
        s: "Ghi đè hộp 0 thành 9."
      },
      {
        k: "input",
        q: "<pre class=\"out\">a = [4, 8, 1]\na[1] = a[1] + 5\nprint(a[1])</pre>In ra số mấy?",
        a: 13,
        h: "Lấy số trong hộp 1, cộng 5, bỏ lại.",
        s: "8 + 5 = 13."
      },
      {
        k: "choice",
        q: "Sau a[0] = 9, các hộp còn lại có đổi không?",
        o: ["Có, tất cả đổi","Không, chỉ hộp 0 đổi"],
        a: 1,
        h: "Chỉ hộp có chỉ số 0 bị ghi đè.",
        s: "Chỉ hộp 0 đổi."
      }
    ],
    dr: "set",
    note: "<b>Ghi đè một hộp: <code>a[i] = x</code></b> đặt x vào hộp i, thay giá trị cũ.<pre>a = [7, 8, 1]\na[0] = 9      # a thành [9, 8, 1]\na[0] = a[1] + 5   # lấy 8 + 5 = 13, a thành [13, 8, 1]</pre>• <b>Chỉ hộp i đổi</b>; các hộp khác giữ nguyên.<br>• Giá trị cũ của hộp i mất, nên muốn giữ thì phải lưu sang chỗ khác trước khi ghi đè.<br>• Vế phải tính xong rồi mới đặt vào hộp bên trái."
  }
];
