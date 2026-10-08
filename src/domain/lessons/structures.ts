import type { RichLesson } from './lesson-types';

export const STRUCTURES_LESSONS: RichLesson[] = [
{
    id: "n1",
    t: "Linked list: mỗi nút biết nút kế tiếp",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">class Nut:\n    def __init__(self, v):\n        self.v = v\n        self.next = None\na = Nut(5)\nb = Nut(8)\nc = Nut(2)\na.next = b\nb.next = c\nprint(a.v)</pre>In ra số mấy?",
        a: 5,
        h: "a.v là giá trị nằm trong nút a.",
        s: "a.v = 5."
      },
      {
        k: "input",
        q: "Nếu in a.next.v thì ra số mấy?",
        a: 8,
        h: "a.next là nút nào? Rồi lấy .v của nút đó.",
        s: "a.next chính là b nên a.next.v = 8."
      },
      {
        k: "input",
        q: "Nếu in a.next.next.v thì ra số mấy?",
        a: 2,
        h: "Đi theo mũi tên hai lần: a, rồi b, rồi ...",
        s: "a.next.next là c nên giá trị là 2."
      },
      {
        k: "choice",
        q: "c.next đang là gì (mình chưa gán gì cho nó)?",
        o: ["None, nghĩa là hết danh sách","8","5"],
        a: 0,
        h: "Trong __init__, next được gán lúc đầu là gì?",
        s: "None đánh dấu nút cuối, không còn nút nào phía sau."
      },
      {
        k: "choice",
        q: "Khác mảng ở chỗ nào?",
        o: [
          "Muốn tới nút thứ 3 phải đi từng nút từ đầu, không nhảy thẳng bằng chỉ số",
          "Linked list luôn nhanh hơn mảng",
          "Linked list không chứa được số"
        ],
        a: 0,
        h: "Mảng có nums[2]. Ở đây có cách nhảy thẳng tới c không?",
        s: "Mỗi nút chỉ biết nút kế tiếp. Đổi lại, chèn và xóa rất gọn."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Không nhìn lại bài: nút trong linked list gồm những gì, và 'next' dùng để làm gì?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Linked list: mỗi nút biết nút kế tiếp, và chỉ biết vậy.</b><pre>class Nut:\n    def __init__(self, v):\n        self.v = v\n        self.next = None\n\na = Nut(5)\nb = Nut(8)\nc = Nut(2)\na.next = b\nb.next = c\nprint(a.v)              # 5\nprint(a.next.v)         # 8\nprint(a.next.next.v)    # 2\nprint(c.next)           # None</pre>\n• Mỗi <b>nút</b> gồm hai phần: <b>giá trị</b> (<code>v</code>) và một <b>mũi tên</b> (<code>next</code>) chỉ tới nút kế tiếp.<br>\n• <code>a.next = b</code> nghĩa là \"mũi tên của a chỉ vào b\". Nên <code>a.next</code> <b>chính là</b> nút b, và <code>a.next.v</code> là <code>b.v</code> = 8. Tương tự <code>a.next.next</code> là nút c, giá trị 2.<br>\n• <code>c.next</code> là <code>None</code>: không có nút nào phía sau. <code>None</code> đánh dấu <b>nút cuối</b>.<br>\n• Khác mảng: không có chỉ số. Muốn tới nút thứ ba phải đi theo mũi tên từng bước.<br>\n<b>Lỗi hay gặp:</b> viết <code>a.v</code> khi muốn giá trị của nút kế (phải là <code>a.next.v</code>); đi quá nút cuối: <code>c.next.v</code> báo <code>AttributeError</code> vì <code>None</code> không có <code>v</code>.<br>\n<b>Mẹo:</b> vẽ các hộp nối bằng mũi tên: [5]→[8]→[2]→None. Mỗi chấm <code>.next</code> là một bước đi theo mũi tên."
  },
{
    id: "n2",
    t: "Đi dọc danh sách: theo mũi tên",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">class Nut:\n    def __init__(self, v):\n        self.v = v\n        self.next = None\na = Nut(5); b = Nut(8); c = Nut(2)\na.next = b; b.next = c\ncur = a\nwhile cur is not None:\n    print(cur.v)\n    cur = cur.next</pre>Có bao nhiêu dòng được in?",
        a: 3,
        h: "Mỗi vòng cur đứng ở một nút. Có mấy nút?",
        s: "3 nút, 3 dòng."
      },
      {
        k: "input",
        q: "Dòng cuối in ra số mấy?",
        a: 2,
        h: "Nút cuối cùng là nút nào?",
        s: "Nút c, giá trị 2."
      },
      {
        k: "choice",
        q: "Nếu quên dòng cur = cur.next thì sao?",
        o: ["Vòng lặp không bao giờ dừng, in mãi số 5","In 5, 8, 2 bình thường","Báo lỗi ngay"],
        a: 0,
        h: "cur có đổi sang nút khác không?",
        s: "cur đứng yên nên điều kiện không bao giờ sai."
      },
      {
        k: "choice",
        q: "Vì sao điều kiện là cur is not None?",
        o: ["Vì sau nút cuối, cur trở thành None nghĩa là đã đi hết","Vì None là số 0","Vì cho đẹp"],
        a: 0,
        h: "Nhớ c.next là gì.",
        s: "None là dấu hiệu hết danh sách."
      },
      {
        k: "input",
        q: "Danh sách có 1000 nút, đi hết cần bao nhiêu bước nhảy sang nút kế?",
        a: 1000,
        h: "Mỗi nút một bước.",
        s: "n nút thì n bước, O(n). Giống duyệt mảng."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Giải thích bằng lời: vì sao vòng while này tự dừng được mà không cần biết trước danh sách dài bao nhiêu?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Đi dọc danh sách: đứng ở một nút, rồi theo mũi tên.</b><pre>class Nut:\n    def __init__(self, v):\n        self.v = v\n        self.next = None\n\na = Nut(5); b = Nut(8); c = Nut(2)\na.next = b; b.next = c\ncur = a\nwhile cur is not None:\n    print(cur.v)\n    cur = cur.next</pre>\n• <code>cur</code> là \"ngón tay\" chỉ vào nút đang xét. Mỗi vòng: in giá trị nút đang chỉ, rồi <b>dời ngón tay</b> sang nút kế bằng <code>cur = cur.next</code>.<br>\n• Chạy tay: cur = a, in 5 → cur = b, in 8 → cur = c, in 2 → cur = <code>None</code>, điều kiện sai, dừng. Tổng cộng <b>3 dòng</b>, dòng cuối là 2.<br>\n• Vòng lặp <b>tự dừng</b> khi gặp <code>None</code>. Bạn không cần biết trước danh sách dài bao nhiêu. Với n nút thì đi hết mất n bước (O(n)), giống duyệt mảng.<br>\n<b>Lỗi hay gặp:</b> quên <code>cur = cur.next</code>: ngón tay đứng yên nên <code>cur is not None</code> không bao giờ sai, vòng lặp chạy mãi. Viết điều kiện <code>while cur.next is not None</code>: vòng dừng sớm một nút, bỏ sót nút cuối (chỉ in 5 và 8).<br>\n<b>Mẹo:</b> điều kiện hỏi \"ngón tay còn đang chỉ vào một nút thật không?\", nên viết <code>cur is not None</code>, không phải <code>cur.next</code>."
  },
{
    id: "n3",
    t: "Chèn vào đầu: đổi mũi tên đúng thứ tự",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">class Nut:\n    def __init__(self, v):\n        self.v = v\n        self.next = None\na = Nut(5); b = Nut(8)\na.next = b\nhead = a\nnew = Nut(9)\nnew.next = head\nhead = new\nprint(head.next.v)</pre>In ra số mấy?",
        a: 5,
        h: "Sau khi chèn, nút đứng đầu là new. Nút ngay sau nó là gì?",
        s: "new.next trỏ tới nút cũ a, giá trị 5."
      },
      {
        k: "choice",
        q: "Nếu đổi thứ tự: chạy head = new TRƯỚC, rồi mới new.next = head. Chuyện gì xảy ra?",
        o: [
          "new.next trỏ lại chính new, và mất đường tới nút cũ",
          "Vẫn đúng như cũ",
          "Báo lỗi cú pháp"
        ],
        a: 0,
        h: "Sau head = new, head còn trỏ tới nút cũ không?",
        s: "Phải nối new vào danh sách cũ TRƯỚC khi đổi head, nếu không sẽ mất nút cũ."
      },
      {
        k: "choice",
        q: "Chèn vào đầu danh sách 1 triệu nút mất mấy bước đổi mũi tên?",
        o: ["Hai bước, không phụ thuộc độ dài","Một triệu bước","Nửa triệu bước"],
        a: 0,
        h: "Ta có phải đi qua các nút phía sau không?",
        s: "Chèn đầu là O(1)."
      },
      {
        k: "choice",
        q: "Với mảng, chèn vào đầu phải làm gì?",
        o: ["Dịch tất cả phần tử sang phải một ô","Không cần làm gì","Xóa mảng"],
        a: 0,
        h: "Ô đầu đang có số rồi, cần chỗ trống ở đâu?",
        s: "Mảng: O(n). Linked list: O(1). Đó là lý do có linked list."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự giải thích: vì sao thứ tự hai dòng 'new.next = head' và 'head = new' lại quan trọng? Thử hình dung bằng mũi tên.",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Chèn vào đầu: nối nút mới vào danh sách cũ TRƯỚC, rồi mới đổi đầu.</b><pre>class Nut:\n    def __init__(self, v):\n        self.v = v\n        self.next = None\n\na = Nut(5); b = Nut(8)\na.next = b\nhead = a\nnew = Nut(9)\nnew.next = head\nhead = new\nprint(head.v)               # 9\nprint(head.next.v)          # 5\nprint(head.next.next.v)     # 8</pre>\n• Ban đầu <code>head</code> chỉ vào a: danh sách là 5 → 8.<br>\n• <code>new.next = head</code>: mũi tên của nút mới chỉ vào <b>nút đầu cũ</b> (a). Lúc này danh sách cũ vẫn còn nguyên, chỉ có thêm nút mới đứng trước nó.<br>\n• <code>head = new</code>: giờ mới đổi \"đầu\" thành nút mới. Kết quả 9 → 5 → 8.<br>\n• <b>Thứ tự hai dòng rất quan trọng.</b> Nếu chạy <code>head = new</code> trước, thì <code>head</code> đã chỉ vào new, và dòng <code>new.next = head</code> khiến nút mới <b>chỉ vào chính nó</b>. Từ <code>head</code> không còn đường nào đi tới 5 và 8 nữa: danh sách <b>bị đứt khỏi đầu</b>. (Trong ví dụ này biến <code>a</code>, <code>b</code> vẫn còn giữ hai nút, nhưng chương trình thật thường không có biến phụ như vậy, và hai nút sẽ mất hẳn.)<br>\n• Chèn vào đầu chỉ đổi <b>vài mũi tên</b>, dù danh sách có 1 triệu nút: O(1). Với mảng, chèn vào đầu phải <b>dời mọi phần tử sang phải</b> một ô: O(n). Đó là lý do có linked list.<br>\n<b>Lỗi hay gặp:</b> đảo thứ tự hai dòng; quên đổi <code>head</code> nên nút mới được tạo mà không ai tìm thấy.<br>\n<b>Mẹo:</b> trước khi đổi một mũi tên, hỏi \"mũi tên cũ này đang giữ nút nào? nếu đổi nó thì có nút nào mất không?\" Luôn nối cái mới vào trước, đổi cái cũ sau."
  },
{
    id: "t1",
    t: "Cây: nút cha và nút con",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">class Cay:\n    def __init__(self, v):\n        self.v = v\n        self.left = None\n        self.right = None\nr = Cay(1)\nr.left = Cay(2)\nr.right = Cay(3)\nr.left.left = Cay(4)\nprint(r.left.v)</pre>In ra số mấy?",
        a: 2,
        h: "r.left là nút con bên trái của r.",
        s: "r.left.v = 2."
      },
      {
        k: "input",
        q: "In r.right.v thì ra số mấy?",
        a: 3,
        h: "Nút con bên phải.",
        s: "3."
      },
      {
        k: "input",
        q: "In r.left.left.v thì ra số mấy?",
        a: 4,
        h: "Đi sang trái hai lần.",
        s: "4."
      },
      {
        k: "input",
        q: "Cây này có tổng cộng bao nhiêu nút?",
        a: 4,
        h: "Đếm: 1, 2, 3, 4.",
        s: "4 nút."
      },
      {
        k: "choice",
        q: "Nút 3 không có con. r.right.left là gì?",
        o: ["None","3","0"],
        a: 0,
        h: "Nút 3 chưa được gán left.",
        s: "Không có con thì là None. Nút như vậy gọi là lá."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Giải thích bằng lời: cây khác linked list ở điểm nào? (Gợi ý: mỗi nút có mấy mũi tên đi ra?)",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Cây: mỗi nút có tối đa hai nút con.</b><pre>      1          nút 1 là gốc\n     / \\\n    2   3        nút 2 và 3 là con của 1\n   /\n  4              nút 4 là con trái của 2</pre><pre>r = Cay(1)\nr.left = Cay(2)\nr.right = Cay(3)\nr.left.left = Cay(4)\nprint(r.left.v)   # 2</pre>• Mỗi nút có ba phần: giá trị <code>v</code>, con trái <code>left</code>, con phải <code>right</code>.<br>• Đọc <code>r.left.v</code> từ trái sang phải: từ <code>r</code>, đi sang con trái, rồi lấy giá trị. <code>r.right.v</code> là 3; <code>r.left.left.v</code> là 4. Cây này có 4 nút.<br>• Nút <b>không có con</b> thì chỗ đó là <code>None</code>. Nút như vậy gọi là <b>lá</b>. Nút 3 là lá nên <code>r.right.left</code> là <code>None</code>.<br><b>Khác linked list:</b> mỗi nút của linked list chỉ có <b>một</b> mũi tên đi ra (sang nút kế); mỗi nút của cây có <b>hai</b> (trái, phải), nên chia nhánh được.<br><b>Lỗi hay gặp:</b> đi tiếp từ <code>None</code>, ví dụ <code>r.right.left.v</code> là lỗi vì <code>None</code> không có <code>v</code>.<br><b>Mẹo:</b> vẽ cây ra giấy rồi đi theo từng chữ <code>left</code>/<code>right</code> bằng ngón tay."
  },
{
    id: "t2",
    t: "Duyệt cây bằng đệ quy",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">class Cay:\n    def __init__(self, v):\n        self.v = v\n        self.left = None\n        self.right = None\ndef dem(nut):\n    if nut is None:\n        return 0\n    return 1 + dem(nut.left) + dem(nut.right)\nr = Cay(1)\nr.left = Cay(2)\nr.right = Cay(3)\nr.left.left = Cay(4)\nprint(dem(None))</pre>dem(None) trả về mấy?",
        a: 0,
        h: "Nhìn dòng if đầu tiên.",
        s: "Ca cơ sở: cây rỗng có 0 nút."
      },
      {
        k: "input",
        q: "dem(r.left.left) là nút 4, nó không có con. Trả về mấy?",
        a: 1,
        h: "1 + dem(None) + dem(None) = 1 + 0 + 0.",
        s: "Nút lá đếm là 1."
      },
      {
        k: "input",
        q: "dem(r.left) là nút 2 với con trái là nút 4. Trả về mấy?",
        a: 2,
        h: "1 + dem(nút 4) + dem(None).",
        s: "1 + 1 + 0 = 2."
      },
      {
        k: "input",
        q: "dem(r) trả về mấy?",
        a: 4,
        h: "1 + dem(nút 2) + dem(nút 3).",
        s: "1 + 2 + 1 = 4."
      },
      {
        k: "input",
        q: "<pre class=\"out\">def p(nut):\n    if nut is None:\n        return\n    print(nut.v)\n    p(nut.left)\n    p(nut.right)</pre>Gọi p(r) trên cây vừa rồi. Dòng thứ 3 in ra số mấy? (thứ tự: 1, 2, ...)",
        a: 4,
        h: "In nút hiện tại, rồi đi hết bên trái, rồi mới sang phải.",
        s: "In ra 1, 2, 4, 3."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Nối với bài đệ quy trước: 'bài nhỏ hơn giống hệt bài lớn' ở cây là gì? Ca cơ sở ở đây là gì?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Duyệt cây bằng đệ quy: bài nhỏ hơn giống hệt bài lớn.</b> Cây con trái và cây con phải cũng là cây.<pre>def dem(nut):\n    if nut is None:        # ca cơ sở: cây rỗng\n        return 0\n    return 1 + dem(nut.left) + dem(nut.right)</pre>• <b>Ca cơ sở</b>: <code>None</code> (cây rỗng) có <b>0</b> nút. Không có ca cơ sở thì đệ quy không bao giờ dừng.<br>• <b>Bước đệ quy</b>: số nút của cây = <b>1</b> (chính nó) + số nút cây con trái + số nút cây con phải.<br>• Trên cây 1, 2, 3, 4 của bài trước: nút 4 là lá: 1 + 0 + 0 = 1; nút 2: 1 + 1 + 0 = 2; nút 3: 1; gốc: 1 + 2 + 1 = <b>4</b>.<br>• <b>Thứ tự in</b> khi dòng <code>print(nut.v)</code> đứng <b>trước</b> hai lời gọi con: nút mình, rồi cả cây con trái, rồi cây con phải. Với cây trên in ra <b>1, 2, 4, 3</b>.<br><b>Lỗi hay gặp:</b> quên ca cơ sở nên gặp <code>None</code> rồi đòi <code>nut.left</code> (lỗi); nhầm thứ tự in khi dòng <code>print</code> đặt ở chỗ khác.<br><b>Mẹo:</b> chạy tay từ <b>lá</b> trở lên: lá trước, rồi cha của nó."
  }
];
