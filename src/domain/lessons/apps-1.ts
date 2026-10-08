import type { RichLesson } from './lesson-types';

export const APPS_1_LESSONS: RichLesson[] = [
{
    id: "ap1",
    t: "Ứng dụng 1: cache, dùng dictionary để khỏi hỏi lại",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">seen = set()\nhits = 0\nfor k in [\"A\", \"B\", \"A\", \"A\", \"C\", \"B\"]:\n    if k in seen:\n        hits += 1\n    else:\n        seen.add(k)\nprint(hits)</pre>Đoạn này mô phỏng cache: gặp lại khóa đã thấy là trúng (hit). In ra mấy?",
        a: 3,
        h: "Dò từng khóa: A mới, B mới, A trùng, A trùng, C mới, B trùng.",
        s: "3 lần trúng, 3 lần trượt."
      },
      {
        k: "input",
        q: "Hỏi cơ sở dữ liệu mất 100ms, tra cache mất 1ms. 6 lần gọi trên: 3 lần trượt (100ms) và 3 lần trúng (1ms). Tổng cộng bao nhiêu ms?",
        a: 303,
        h: "3 * 100 + 3 * 1.",
        s: "303ms. Không có cache thì 6 * 100 = 600ms."
      },
      {
        k: "choice",
        q: "Giá sản phẩm đã đổi trong cơ sở dữ liệu nhưng cache vẫn giữ giá cũ. Đây là vấn đề gì?",
        o: [
          "Dữ liệu cũ (stale): cache cần có hạn dùng hoặc cách làm mới",
          "Cache chạy nhanh quá",
          "Không phải vấn đề"
        ],
        a: 0,
        h: "Cache nhanh nhưng có bao giờ tự biết dữ liệu gốc đã đổi?",
        s: "Vì thế hệ thống thật luôn nghĩ tới hết hạn (TTL) và xóa cache khi dữ liệu đổi."
      },
      {
        k: "choice",
        q: "Vì sao cache thường dùng dictionary?",
        o: ["Tra theo khóa gần như một bước, O(1)","Vì dictionary nhỏ","Vì dictionary tự sắp xếp"],
        a: 0,
        h: "Nhớ bài hash map: tra key mất bao nhiêu bước?",
        s: "Chính ý tưởng Two Sum: nhớ cái đã gặp để tra nhanh."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Ứng dụng: nghĩ một hệ thống bạn dùng hằng ngày (trang tin, bản đồ, mạng xã hội) chỗ nào có thể dùng cache? Nếu dữ liệu đổi liên tục thì cache có lợi không?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Cache: nhớ kết quả đã hỏi để khỏi hỏi lại chỗ chậm.</b><br>\nÝ tưởng giống Two Sum: nhớ cái đã gặp để tra nhanh sau này. Ví dụ trong bài:<pre>seen = set()\nhits = 0\nfor k in [\"A\", \"B\", \"A\", \"A\", \"C\", \"B\"]:\n    if k in seen:\n        hits += 1\n    else:\n        seen.add(k)\nprint(hits)    # 3</pre>\n• Dò từng khóa: A mới, B mới, A trùng (trúng), A trùng (trúng), C mới, B trùng (trúng) → <b>3 lần trúng</b>, 3 lần trượt.<br>\n• <b>Tiết kiệm bao nhiêu?</b> Hỏi cơ sở dữ liệu mất 100 ms, tra cache mất 1 ms. Có cache: 3 × 100 + 3 × 1 = <b>303 ms</b>. Không cache: 6 × 100 = 600 ms.<br>\nCache thật còn phải nhớ <b>giá trị</b>, nên dùng dictionary chứ không chỉ set:<pre>cache = {}\ngoi_db = 0\ndef gia(ma):\n    global goi_db\n    if ma not in cache:\n        goi_db += 1\n        cache[ma] = ma * 10\n    return cache[ma]\nfor m in [1, 2, 1, 1, 3, 2]:\n    gia(m)\nprint(goi_db)    # 3</pre>\n• Sáu lần hỏi nhưng chỉ <b>3 lần</b> chạm cơ sở dữ liệu (cho mã 1, 2, 3). Dictionary tra theo khóa gần như một bước, đúng bài hash map.<br>\n<b>Cái giá của cache: dữ liệu cũ (stale).</b><pre>db = {\"A\": 10}\ncache = {}\ncache[\"A\"] = db[\"A\"]\ndb[\"A\"] = 12\nprint(cache[\"A\"], db[\"A\"])    # 10 12</pre>\n• Giá gốc đã đổi thành 12 nhưng cache vẫn trả 10. Cache nhanh nhưng <b>không tự biết</b> dữ liệu gốc đã đổi. Vì thế hệ thống thật luôn nghĩ tới <b>hết hạn</b> (TTL) hoặc xóa cache khi dữ liệu đổi.<br>\n<b>Lỗi hay gặp:</b> tưởng cache luôn có lợi (dữ liệu đổi liên tục thì cache hầu như toàn trượt, chỉ tốn thêm bộ nhớ); quên rằng cache có thể sai; lẫn \"trúng\" với \"trượt\".<br>\n<b>Mẹo:</b> khi nghĩ tới cache, hỏi hai câu: <i>cùng một câu hỏi có lặp lại nhiều không?</i> và <i>câu trả lời cũ có thể sai trong bao lâu mà chấp nhận được?</i> Cả hai đều có đáp án tốt thì cache mới đáng dùng."
  },
{
    id: "ap2",
    t: "Ứng dụng 2: hàng đợi công việc (job queue)",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">q = []\nq.append(\"A\")\nq.append(\"B\")\nq.append(\"C\")\nq.pop(0)\nq.pop(0)\nprint(len(q))</pre>Các công việc A, B, C xếp hàng chờ in. Sau hai lần lấy ra, còn bao nhiêu việc?",
        a: 1,
        h: "Mỗi pop(0) lấy một việc ra khỏi đầu hàng.",
        s: "Còn C, tức 1 việc."
      },
      {
        k: "choice",
        q: "Công việc nào được lấy ra làm đầu tiên?",
        o: ["A, vì vào trước ra trước","C, vì mới nhất","B, ở giữa"],
        a: 0,
        h: "Nghĩ tới hàng người xếp ở quầy.",
        s: "Queue là vào trước ra trước, công bằng với người đến trước."
      },
      {
        k: "choice",
        q: "Vì sao hàng chờ in dùng queue chứ không dùng stack?",
        o: [
          "Stack sẽ làm việc đến sau chen lên trước, người đến trước có thể chờ mãi",
          "Stack in nhanh hơn",
          "Không khác nhau"
        ],
        a: 0,
        h: "Với stack, lấy ra việc nào đầu tiên?",
        s: "Công bằng và đoán trước được thứ tự là lý do dùng queue."
      },
      {
        k: "choice",
        q: "Trong thực tế, hệ thống xử lý đơn hàng, gửi email, hay tải video thường làm gì khi lượng việc dồn lên đột ngột?",
        o: ["Cho việc vào hàng đợi, xử lý dần theo khả năng","Từ chối tất cả","Làm hết cùng lúc"],
        a: 0,
        h: "Làm hết cùng lúc có thể làm sập máy.",
        s: "Hàng đợi giữ việc lại để hệ thống không bị quá tải."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Ứng dụng: kể hai hệ thống thật dùng hàng đợi, và nói chuyện gì sẽ xảy ra nếu thiếu hàng đợi lúc đông người.",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Hàng đợi công việc (job queue): việc nào đến trước thì làm trước.</b><br>\nMáy in, gửi email, xử lý đơn hàng đều có lúc việc đến dồn dập hơn khả năng làm. Cho việc <b>xếp hàng</b> và làm dần, thay vì từ chối hoặc làm hết cùng lúc (có thể làm sập máy).<br>\n<b>Chạy tay.</b> Ba việc A, B, C xếp hàng, sau đó lấy ra hai lần:<pre>q = []\nq.append(\"A\")\nq.append(\"B\")\nq.append(\"C\")\nq.pop(0)\nq.pop(0)\nprint(q)    # ['C']</pre>\n• <code>append</code> đưa việc vào <b>cuối</b> hàng: <code>[A, B, C]</code>. <code>pop(0)</code> lấy việc ở <b>đầu</b> hàng: lần một lấy A, lần hai lấy B. Còn lại <code>['C']</code>, tức <b>1</b> việc.<br>\n• Việc làm đầu tiên là <b>A</b>: vào trước, ra trước (FIFO).<br>\n<b>Vì sao không dùng stack?</b> Với stack, việc đến sau chen lên trước:<pre>s = [\"A\", \"B\", \"C\"]\nprint(s.pop())    # C</pre>\n• Stack lấy ra <b>C</b> trước. Khi việc liên tục đến, A có thể chờ mãi vì luôn có việc mới chen lên trên. Queue công bằng và dự đoán được thứ tự, đó là lý do hàng chờ dùng queue.<br>\n<b>Lỗi hay gặp:</b> nhầm <code>pop()</code> (lấy cuối, kiểu stack) với <code>pop(0)</code> (lấy đầu, kiểu queue); lấy ra từ hàng rỗng (<code>[].pop(0)</code> báo <code>IndexError</code>), nên cần kiểm tra hàng còn việc không trước khi lấy.<br>\n<b>Lưu ý:</b> <code>pop(0)</code> trên list phải dời mọi phần tử còn lại, chậm khi hàng dài. Hệ thống thật dùng <code>deque</code> (như bài hàng đợi). Ở đây dùng list cho dễ nhìn.<br>\n<b>Mẹo:</b> khi đọc đề, tìm câu hỏi \"ai được phục vụ trước?\". Đáp án \"người đến trước\" là queue, \"việc mới nhất\" là stack."
  },
{
    id: "ap3",
    t: "Ứng dụng 3: Undo và kiểm tra ngoặc bằng stack",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">history = []\nhistory.append(\"a\")\nhistory.append(\"b\")\nhistory.append(\"c\")\nhistory.pop()\nhistory.pop()\nprint(len(history))</pre>Mỗi append là một thao tác soạn thảo, mỗi pop là một lần Undo. Còn bao nhiêu thao tác trong lịch sử?",
        a: 1,
        h: "Ba thao tác, hai lần hoàn tác.",
        s: "Còn thao tác a."
      },
      {
        k: "choice",
        q: "Undo lần đầu hoàn tác thao tác nào?",
        o: ["Thao tác gần nhất (c)","Thao tác đầu tiên (a)","Thao tác ở giữa"],
        a: 0,
        h: "Bạn nhấn Ctrl+Z ngay sau khi gõ chữ.",
        s: "Vào sau ra trước: đúng bản chất stack."
      },
      {
        k: "choice",
        q: "Kiểm tra chuỗi ngoặc ([)]: gặp ] thì đỉnh stack đang là ( . Kết luận gì?",
        o: ["Không hợp lệ, vì ] phải đóng [ chứ không phải (","Hợp lệ","Bỏ qua"],
        a: 0,
        h: "Đỉnh stack là ngoặc mở gần nhất còn chưa được đóng.",
        s: "Ngoặc mở gần nhất phải được đóng trước."
      },
      {
        k: "choice",
        q: "Trình biên dịch và trình soạn thảo code dùng ý tưởng nào để báo lỗi ngoặc?",
        o: ["Stack các ngoặc đang mở","Sắp xếp","Cache"],
        a: 0,
        h: "Cái nào đóng trước: ngoặc mở sau hay mở trước?",
        s: "Stack là công cụ tự nhiên cho cấu trúc lồng nhau."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Ứng dụng: ngoài Undo và kiểm tra ngoặc, nút Back của trình duyệt có phải stack không? Giải thích bằng lời.",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Stack trong đời thật: Undo, và kiểm tra ngoặc.</b> Cả hai đều theo nguyên tắc <b>vào sau, ra trước</b>.<br>\n<b>Undo.</b> Mỗi thao tác soạn thảo được đẩy vào stack, mỗi lần Undo lấy ra thao tác trên cùng:<pre>history = []\nhistory.append(\"a\")\nhistory.append(\"b\")\nhistory.append(\"c\")\nhistory.pop()\nhistory.pop()\nprint(history)    # ['a']</pre>\n• Ba thao tác, hai lần Undo (hoàn tác c rồi b), còn lại <b>thao tác a</b>. Undo lần đầu hoàn tác thao tác <b>gần nhất</b>, đúng như khi bạn nhấn Ctrl+Z ngay sau khi gõ.<br>\n<b>Kiểm tra ngoặc.</b> Ngoặc mở nào chưa được đóng thì nằm trong stack; ngoặc <b>mở gần nhất</b> phải được đóng <b>trước</b>:<pre>def hop_le(s):\n    cap = {\")\": \"(\", \"]\": \"[\"}\n    st = []\n    for ch in s:\n        if ch in \"([\":\n            st.append(ch)\n        elif ch in \")]\":\n            if not st or st.pop() != cap[ch]:\n                return False\n    return not st\nprint(hop_le(\"([])\"))    # True\nprint(hop_le(\"([)]\"))    # False\nprint(hop_le(\"((\"))    # False\nprint(hop_le(\")(\"))    # False</pre>\n• <code>\"([)]\"</code>: gặp <code>(</code> rồi <code>[</code>, stack là <code>[(, []</code>. Gặp <code>)</code> thì lấy ra đỉnh là <code>[</code>, mà <code>)</code> cần <code>(</code>, không khớp → <b>không hợp lệ</b>. Dù mỗi loại ngoặc đều đủ cặp, thứ tự lồng nhau sai.<br>\n• Hai ca biên: <code>\"((\"</code> hết chuỗi mà stack còn ngoặc mở nên sai (vì thế cuối hàm kiểm tra <code>not st</code>); <code>\")(\"</code> gặp ngoặc đóng khi stack rỗng nên sai (vì thế có <code>not st</code> trước <code>st.pop()</code>).<br>\n• Trình soạn thảo code và trình biên dịch dùng đúng ý tưởng này để báo lỗi ngoặc.<br>\n<b>Lỗi hay gặp:</b> chỉ đếm số ngoặc mở và đóng bằng nhau là đủ (bị đánh lừa bởi <code>\"([)]\"</code>); quên kiểm tra stack rỗng trước khi lấy ra (gây <code>IndexError</code>); quên kiểm tra stack phải rỗng ở cuối.<br>\n<b>Mẹo:</b> cấu trúc <b>lồng nhau</b> (ngoặc, thẻ HTML, gọi hàm trong hàm) gần như luôn gợi ý stack. Tự hỏi \"cái nào mở sau thì phải đóng trước?\"."
  }
];
