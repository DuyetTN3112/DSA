import type { RichLesson } from './lesson-types';

export const K3_LESSONS: RichLesson[] = [
{
    id: "k3",
    t: "Thứ tự, và vì sao máy đếm từ 0",
    steps: [
      {
        k: "choice",
        q: "Bốn bạn xếp hàng 👧 👦 🧒 👶. Bạn đứng đầu hàng là bạn thứ mấy, khi đếm như thường ngày?",
        o: ["Thứ nhất","Thứ hai","Thứ không"],
        a: 0,
        h: "Người đầu tiên.",
        s: "Thường ngày ta đếm: thứ nhất, thứ hai..."
      },
      {
        k: "input",
        q: "Bạn đứng thứ nhất có mấy người đứng TRƯỚC mình?",
        a: 0,
        h: "Đứng đầu hàng, phía trước có ai không?",
        s: "Không có ai, tức là 0 người."
      },
      {
        k: "input",
        q: "Bạn đứng thứ hai có mấy người đứng trước?",
        a: 1,
        h: "Phía trước chỉ có bạn đầu hàng.",
        s: "1 người."
      },
      {
        k: "input",
        q: "Bạn đứng thứ năm có mấy người đứng trước?",
        a: 4,
        h: "Thứ năm thì trước đó có 4 bạn.",
        s: "4 người."
      },
      {
        k: "choice",
        q: "Máy tính không hỏi 'thứ mấy', mà hỏi 'có mấy người đứng trước'. Gọi như vậy thì bạn đầu hàng mang số mấy?",
        o: ["0","1"],
        a: 0,
        h: "Bạn đầu hàng có mấy người đứng trước?",
        s: "Số này gọi là chỉ số (index). Chỉ số = số người đứng trước. Vì thế máy đếm từ 0, đây không phải điều kỳ lạ."
      },
      {
        k: "click",
        q: "Bốn bạn dưới đây. Mỗi bạn mang số = số người đứng trước. Bấm vào bạn mang số 2.",
        a: 2,
        h: "Số 2 nghĩa là phía trước có 2 bạn. Đứng ở đâu thì có 2 bạn đứng trước?",
        s: "Bạn thứ ba trong hàng mang số 2.",
        arr: ["👧","👦","🧒","👶"],
        noidx: 1
      },
      {
        k: "input",
        q: "Hàng có 5 bạn. Bạn cuối cùng mang số mấy?",
        a: 4,
        h: "Phía trước bạn cuối có mấy bạn?",
        s: "Bạn cuối có 4 bạn đứng trước nên mang số 4. Hàng n bạn thì bạn cuối mang số n - 1."
      }
    ],
    dr: "tt",
    note: "<b>Hai cách đếm, hai câu hỏi khác nhau.</b><br>• Đếm thường ngày hỏi: <i>\"bạn này đứng thứ mấy?\"</i> → thứ nhất, thứ hai, thứ ba...<br>• Máy hỏi: <i>\"phía trước bạn này có mấy người?\"</i> → bạn đầu hàng có <b>0</b> người đứng trước, bạn kế có <b>1</b>, bạn kế nữa có <b>2</b>...<br>Số \"người đứng trước\" gọi là <b>chỉ số (index)</b>. Vì bạn đầu hàng không có ai đứng trước nên chỉ số là 0. Máy đếm từ 0 không phải vì kỳ lạ, mà vì nó đếm \"đã đi qua bao nhiêu\".<br><b>Hai quy tắc dùng ngay:</b> (1) vị trí thứ k (đếm thường ngày) có chỉ số <b>k - 1</b>; (2) hàng có n bạn thì bạn cuối có chỉ số <b>n - 1</b> (không phải n).<br><b>Mẹo kiểm tra:</b> hàng 5 bạn thì các chỉ số là 0, 1, 2, 3, 4. Nếu bạn viết ra chỉ số 5 thì đã vượt quá hàng.",
    nbk: {
      idea: "Chỉ số (index) là câu trả lời của máy cho câu hỏi «có mấy người đứng trước?» — cách máy xác định vị trí của một phần tử trong hàng.",
      why: "Khi có một hàng phần tử, ta cần một cách gọi tên từng vị trí không mơ hồ. «Đứng thứ ba» của người này có thể thành «thứ tư» nếu cách đếm khác nhau. Máy đếm «đã đi qua bao nhiêu phần tử» nên mọi lúc mọi nơi đều giống nhau.",
      model: "Hai cách đếm, hai câu hỏi khác nhau. Đếm thường ngày hỏi: «bạn này đứng thứ mấy?» → thứ nhất, thứ hai, thứ ba… Máy hỏi: «phía trước bạn này có mấy người?» → bạn đầu hàng có <b>0</b> người đứng trước, bạn kế có <b>1</b>, bạn kế nữa có <b>2</b>… Số «người đứng trước» gọi là <b>chỉ số (index)</b>.",
      rule: "Vị trí thứ k (đếm thường ngày) có chỉ số <b>k − 1</b>. Hàng có n bạn thì bạn cuối có chỉ số <b>n − 1</b> (không phải n).",
      ex: "Hàng: An, Bình, Chi, Dũng. Chi <b>đứng thứ 3</b>, có <b>2 người đứng trước</b> (An, Bình) → <b>chỉ số của Chi là 2</b>.",
      trace: "Đếm người đứng trước Chi: An → 1, Bình → 2. Dừng lại. Chỉ số = 2. Kiểm tra ngược: chỉ số 2 + 1 = 3 → đúng là «đứng thứ 3».",
      anti: "Chỉ số 0 <b>không</b> có nghĩa là «không có ai» — đó là bạn đầu hàng. «Không có ai / hộp không tồn tại» trong Python là lỗi <code>IndexError</code>.",
      pitfalls: "Viết chỉ số n cho hàng n bạn (vượt quá hàng); nhầm «thứ tự» với «chỉ số» khi đề hỏi một đằng, mình trả lời một nẻo; viết <code>a[len(a)]</code> thay vì <code>a[len(a) - 1]</code>.",
      selfcheck: "Mẹo kiểm tra: hàng 5 bạn thì các chỉ số là 0, 1, 2, 3, 4. Nếu bạn viết ra chỉ số 5 thì đã vượt quá hàng. Mỗi lần dùng chỉ số, tự hỏi: «có mấy người đứng trước?»",
      link: "Trong bài đang làm: đề hỏi «vị trí» thì trả chỉ số; đề hỏi «giá trị» thì trả <code>numbers[i]</code>. Đọc đề (rd1): gạch chân xem đề hỏi giá trị hay vị trí trước khi tính.",
      pre: ["k1"],
      links: ["rd1","l1","a2"]
    }
  }
];
