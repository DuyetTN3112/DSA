import type { RichLesson } from './lesson-types';

export const KINDERGARTEN_1_LESSONS: RichLesson[] = [
{
    id: "k1",
    t: "Đếm: mỗi vật một con số",
    steps: [
      {
        k: "tap",
        q: "Đây là mấy quả táo. Em chạm vào từng quả một. Mỗi lần chạm, dưới quả táo hiện số tiếp theo: 1, 2, 3... Chạm hết là xong.",
        h: "Chạm vào từng vật một, mỗi vật chỉ chạm một lần, rồi nhìn số hiện dưới vật.",
        s: "Đếm là cho mỗi vật đúng một số, lần lượt.",
        arr: ["🍎","🍎","🍎"],
        noidx: 1
      },
      {
        k: "input",
        q: "Có tất cả mấy quả táo? Gợi ý: số cuối cùng em vừa đọc chính là câu trả lời.",
        a: 3,
        h: "Quả cuối cùng mang số mấy?",
        s: "Số cuối cùng cho biết có bao nhiêu vật.",
        arr: ["🍎","🍎","🍎"],
        noidx: 1
      },
      {
        k: "tap",
        q: "Bây giờ là các ngôi sao. Chạm từng ngôi sao một.",
        h: "Chạm vào từng vật một, mỗi vật chỉ chạm một lần, rồi nhìn số hiện dưới vật.",
        s: "Đếm 5 ngôi sao.",
        arr: ["⭐","⭐","⭐","⭐","⭐"],
        noidx: 1
      },
      {
        k: "input",
        q: "Có mấy ngôi sao?",
        a: 5,
        h: "Số cuối cùng khi chạm xong.",
        s: "Có 5 ngôi sao.",
        arr: ["⭐","⭐","⭐","⭐","⭐"],
        noidx: 1
      },
      {
        k: "choice",
        q: "Nếu em chạm một quả táo hai lần thì kết quả đếm có đúng không?",
        o: ["Sai, vì có quả bị đếm hai lần","Vẫn đúng"],
        a: 0,
        h: "Mỗi vật chỉ được đếm một lần.",
        s: "Đếm đúng là mỗi vật một lần, không sót, không trùng. Sau này ta gọi là duyệt từng phần tử."
      },
      {
        k: "input",
        q: "🐶 🐶 🐶 🐶  Có mấy con chó?",
        a: 4,
        h: "Chỉ vào từng con và đếm.",
        s: "Có 4 con."
      },
      {
        k: "input",
        q: "🍎 🍎  Có mấy quả chuối?",
        a: 0,
        h: "Em có thấy quả chuối nào không?",
        s: "Không có quả nào thì số là 0. Số 0 nghĩa là 'không có gì'."
      }
    ],
    dr: "dem",
    note: "<b>Đếm là gán cho mỗi vật đúng một con số, lần lượt.</b><br>\n• Chạm quả táo thứ nhất → \"1\". Chạm quả thứ hai → \"2\". Cứ thế. <b>Mỗi vật được chạm đúng một lần.</b><br>\n• Chạm xong hết thì <b>số cuối cùng em vừa đọc chính là tổng số vật</b>. Không cần đếm lại từ đầu.<br>\n• Nếu không có vật nào thì số là <b>0</b>. \"0\" nghĩa là \"không có gì\", và đó vẫn là một câu trả lời đúng. Ví dụ: có 🍎 🍎 mà hỏi \"mấy quả chuối?\" thì trả lời 0.<br>\n<b>Lỗi hay gặp:</b> chạm sót một vật (đếm thiếu), chạm một vật hai lần (đếm thừa), hoặc đếm cả những vật không được hỏi (đề hỏi chuối mà đếm táo).<br>\n<b>Vì sao học bài này?</b> Đếm đúng \"mỗi vật một lần, không sót, không trùng\" sau này gọi là <b>duyệt từng phần tử</b>. Mọi vòng lặp trong code đều làm đúng việc này.<br>\n<b>Mẹo:</b> trước khi đếm, đọc kỹ đề hỏi đếm cái gì. Khi đếm, đẩy vật đã đếm sang một bên để khỏi đếm lại."
  },
{
    id: "k2",
    t: "Nhiều hơn, ít hơn, bằng nhau",
    steps: [
      {
        k: "choice",
        q: "🍎 🍎 🍎  và  🍎 🍎 🍎 🍎 🍎. Bên nào nhiều hơn?",
        o: ["Bên có 3 quả","Bên có 5 quả","Bằng nhau"],
        a: 1,
        h: "Đếm từng bên, rồi so hai số.",
        s: "Đếm xong mới so: 5 nhiều hơn 3."
      },
      {
        k: "choice",
        q: "🍌 🍌 🍌 🍌  và  🍌 🍌. Bên nào ÍT hơn?",
        o: ["Bên có 4 quả","Bên có 2 quả","Bằng nhau"],
        a: 1,
        h: "Ít hơn là số nhỏ hơn.",
        s: "2 ít hơn 4."
      },
      {
        k: "choice",
        q: "⭐ ⭐  và  🌙 🌙. Hai bên thế nào?",
        o: ["Sao nhiều hơn","Trăng nhiều hơn","Bằng nhau"],
        a: 2,
        h: "Đếm từng bên: có hai con số giống nhau không?",
        s: "Cả hai bên đều 2, bằng nhau."
      },
      {
        k: "input",
        q: "Số nào lớn hơn: 7 hay 4? Gõ số lớn hơn.",
        a: 7,
        h: "Số lớn hơn là số chỉ nhiều hơn.",
        s: "7 lớn hơn 4."
      },
      {
        k: "choice",
        q: "Dấu > giống cái miệng cá sấu, miệng há về phía số lớn hơn. 7 > 4 có đúng không?",
        o: ["Đúng, miệng há về phía 7","Sai"],
        a: 0,
        h: "Miệng cá sấu há về phía bên nào lớn hơn?",
        s: "7 > 4 đúng. Sau này máy hỏi 'x > best' là hỏi đúng câu này."
      },
      {
        k: "choice",
        q: "9 > 12 đúng hay sai?",
        o: ["Đúng","Sai"],
        a: 1,
        h: "9 và 12, số nào lớn hơn?",
        s: "12 lớn hơn 9 nên 9 > 12 là sai."
      },
      {
        k: "choice",
        q: "5 > 5 đúng hay sai? Hai bên bằng nhau.",
        o: ["Sai, vì 5 không lớn hơn 5","Đúng"],
        a: 0,
        h: "Lớn hơn nghĩa là phải nhiều hơn thật sự.",
        s: "Bằng nhau thì chưa phải lớn hơn. Chỗ này sau này gây rất nhiều lỗi trong code."
      }
    ],
    note: "<b>So sánh: đếm xong rồi mới so.</b><br>\n• Bên nào có số lớn hơn thì <b>nhiều hơn</b>, số nhỏ hơn thì <b>ít hơn</b>, hai số giống nhau thì <b>bằng nhau</b>. Ví dụ ⭐⭐ và 🌙🌙: hai bên đều 2, bằng nhau, dù hình khác nhau.<br>\n• Dấu <code>&gt;</code> giống cái miệng cá sấu: <b>miệng luôn há về phía số lớn hơn</b>. 7 &gt; 4 đúng; 9 &gt; 12 sai vì 12 mới là số lớn hơn.<br>\n• <b>Bằng nhau thì chưa phải lớn hơn.</b> 5 &gt; 5 là <b>sai</b>.<br>\nVề sau, máy hỏi y như vậy và trả lời <code>True</code> (đúng) hoặc <code>False</code> (sai):<pre>print(7 &gt; 4)    # True\nprint(9 &gt; 12)   # False\nprint(5 &gt; 5)    # False</pre>\n<b>Lỗi hay gặp:</b> so sánh bằng mắt trước khi đếm (bên nào \"trông\" dày hơn); đọc ngược miệng cá sấu; coi hai số bằng nhau là \"lớn hơn\". Lỗi cuối cùng này gây rất nhiều bug trong code: <code>x &gt; best</code> khác <code>x &gt;= best</code> đúng ở trường hợp hai số bằng nhau.<br>\n<b>Mẹo:</b> gặp hai số bằng nhau, luôn dừng lại hỏi: đề muốn \"lớn hơn\" hay \"lớn hơn hoặc bằng\"?"
  },
{
    id: "k4",
    t: "Cái tên và cái hộp",
    steps: [
      {
        k: "choice",
        q: "Có 3 hộp giống hệt nhau, đều đựng đồ. Làm sao em tìm đúng hộp đựng bút?",
        o: ["Dán nhãn tên lên mỗi hộp","Mở hộp ngẫu nhiên","Nhớ trong đầu"],
        a: 0,
        h: "Nếu có 100 hộp thì nhớ trong đầu có ổn không?",
        s: "Ta dán nhãn. Cái nhãn là tên của hộp."
      },
      {
        k: "choice",
        q: "Hộp có nhãn 'bút' đang chứa cây ✏️. Đâu là tên, đâu là thứ bên trong?",
        o: ["Nhãn là tên, ✏️ là thứ bên trong","Nhãn là thứ bên trong"],
        a: 0,
        h: "Cái dán bên ngoài hộp là gì?",
        s: "Tên nằm ngoài, đồ nằm trong."
      },
      {
        k: "choice",
        q: "Em thay ✏️ bằng 🖊️ trong hộp 'bút'. Cái nhãn 'bút' có đổi không?",
        o: ["Không, nhãn giữ nguyên, chỉ thứ bên trong đổi","Có, nhãn đổi theo"],
        a: 0,
        h: "Em có cần dán nhãn mới không?",
        s: "Đây chính là biến: tên giữ nguyên, giá trị bên trong có thể đổi."
      },
      {
        k: "input",
        q: "Hộp 'tuổi' đang chứa số 10. Sang năm cộng thêm 1. Hộp 'tuổi' giờ chứa số mấy?",
        a: 11,
        h: "10 thêm 1.",
        s: "11. Hộp giữ nguyên tên, đổi số bên trong."
      },
      {
        k: "input",
        q: "Hộp 'a' chứa 5, hộp 'b' chứa 3. Đổ hết cả hai vào hộp 'c'. Hộp 'c' chứa mấy?",
        a: 8,
        h: "Gộp 5 và 3.",
        s: "8."
      },
      {
        k: "choice",
        q: "Hai hộp khác tên có thể cùng chứa số 4 không?",
        o: ["Có, tên khác nhau không bắt buộc đồ khác nhau","Không"],
        a: 0,
        h: "Tên là để gọi hộp, đâu có nói bên trong chứa gì.",
        s: "Có. Tên chỉ để tìm hộp."
      }
    ],
    note: "<b>Cái tên và cái hộp: tên nằm ngoài, đồ nằm trong.</b><br>\n• Nhiều hộp giống hệt nhau thì không biết hộp nào đựng gì. Ta dán <b>nhãn</b>. Cái nhãn là <b>tên</b> của hộp.<br>\n• Hộp \"bút\" đang chứa ✏️. Đổi ✏️ thành 🖊️ thì <b>nhãn \"bút\" vẫn nguyên</b>, chỉ thứ bên trong đổi. Đây chính là <b>biến</b>: tên giữ nguyên, giá trị bên trong có thể đổi.<br>\n• Hộp \"tuổi\" chứa 10. Sang năm cộng 1: <code>10 → 11</code>. Hộp vẫn tên \"tuổi\", bên trong giờ là 11.<br>\n• Hộp \"a\" chứa 5, hộp \"b\" chứa 3. Đổ cả hai vào hộp \"c\": <code>5 + 3 = 8</code>, hộp \"c\" chứa 8. Hộp \"a\" và \"b\" vẫn còn nguyên khi ta chỉ lấy giá trị của chúng ra dùng.<br>\n• Hai hộp khác tên vẫn có thể cùng chứa số 4. Tên chỉ để <b>tìm hộp</b>, không nói hộp chứa gì.<br>\n<b>Lỗi hay gặp:</b> tưởng đổi đồ trong hộp thì phải đổi cả tên; tưởng hai hộp chứa cùng số thì là cùng một hộp; nhầm tên hộp với thứ bên trong.<br>\n<b>Mẹo:</b> khi bí, vẽ các hộp ra giấy: nhãn ở ngoài, số ở trong. Sau mỗi bước, gạch số cũ và viết số mới vào hộp."
  },
{
    id: "k5",
    t: "Máy chỉ làm đúng từng lệnh",
    steps: [
      {
        k: "order",
        ph: "Luyện làm theo thứ tự",
        q: "Sắp xếp việc đánh răng theo thứ tự thực hiện.",
        s: "Đã sắp đúng thứ tự",
        items: [
          ["Cầm bàn chải","Em cần có gì trong tay trước tiên?"],
          ["Bóp kem lên bàn chải","Có bàn chải rồi, cần thêm gì?"],
          ["Chải răng","Có kem rồi thì làm gì?"],
          ["Súc miệng","Chải xong thì làm gì?"]
        ]
      },
      {
        k: "choice",
        q: "Em nhờ người máy: 'Đi lấy cốc nước'. Người máy đứng im. Vì sao?",
        o: ["Máy chỉ làm đúng điều ta nói rõ từng bước, không tự đoán","Máy lười"],
        a: 0,
        h: "Máy có biết 'cốc' ở đâu không?",
        s: "Máy không đoán ý. Ta phải nói rõ từng bước."
      },
      {
        k: "choice",
        q: "Cách nào nói với người máy tốt hơn?",
        o: ["Bước 1 bước, bước 1 bước nữa, rồi dừng","Đi lại gần cái bàn đi"],
        a: 0,
        h: "Máy hiểu 'gần' là bao xa?",
        s: "Lệnh rõ, nhỏ, làm được ngay thì máy mới làm đúng."
      },
      {
        k: "order",
        ph: "Luyện làm theo thứ tự",
        q: "Sắp xếp việc làm bánh mì kẹp bơ.",
        s: "Đã sắp đúng thứ tự",
        items: [
          ["Lấy hai lát bánh mì","Cần nguyên liệu gì trước?"],
          ["Phết bơ lên một lát","Có bánh rồi, làm gì với bơ?"],
          ["Úp lát kia lên","Đã phết bơ xong, ghép thế nào?"],
          ["Cắt đôi và ăn","Ghép xong rồi thì sao?"]
        ]
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự nghĩ và viết ra: các bước đi từ giường ra tới cửa phòng ngủ, rõ đến mức người máy làm được. (Viết thô cũng được. Đây là bước đầu của việc viết thuật toán.)",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Máy không đoán ý.</b> Nó làm đúng từng lệnh, từ trên xuống, mỗi lần một lệnh.<br>• Lệnh phải <b>rõ, nhỏ, làm được ngay</b>. \"Dọn phòng\" là lệnh quá to; \"nhặt cái áo lên\" mới là lệnh máy làm được.<br>• Thiếu một lệnh hoặc sai thứ tự thì kết quả sai, dù ý bạn đúng.<br><b>Mẹo:</b> tự đóng vai máy. Làm từng lệnh một trên giấy và ghi lại điều gì đã thay đổi sau mỗi lệnh."
  }
];
