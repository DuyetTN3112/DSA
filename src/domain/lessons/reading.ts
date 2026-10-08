import type { RichLesson } from './lesson-types';

export const READING_LESSONS: RichLesson[] = [
{
    id: "rd1",
    t: "Đọc đề: đề cho gì, hỏi gì",
    steps: [
      {
        k: "choice",
        q: "Đề: «Lan có 5 cái kẹo, cho Nam 2 cái. Hỏi Lan còn mấy cái kẹo?». Đề CHO ta những thông tin nào?",
        o: ["Lan có 5 cái kẹo, và cho Nam 2 cái","Lan còn mấy cái kẹo","Nam rất thích kẹo"],
        a: 0,
        h: "CHO là những điều đề đã nói chắc chắn, chưa phải điều phải tìm.",
        s: "CHO = điều đề đã nói sẵn: có 5 cái, cho đi 2 cái."
      },
      {
        k: "choice",
        q: "Vẫn đề đó: «Lan có 5 cái kẹo, cho Nam 2 cái. Hỏi Lan còn mấy cái kẹo?». Đề HỎI điều gì?",
        o: ["Lan còn mấy cái kẹo","Lan cho Nam mấy cái","Lan có mấy cái lúc đầu"],
        a: 0,
        h: "Tìm câu có chữ 'hỏi' hoặc 'mấy'. Điều phải tìm nằm ở đó.",
        s: "HỎI = điều ta phải tìm ra. Thường nằm ở câu có 'hỏi', 'mấy', 'bao nhiêu' hoặc dấu ?."
      },
      {
        k: "input",
        q: "Hiểu đề xong mới tính. Lan còn mấy cái kẹo?",
        a: 3,
        h: "Có 5, cho đi 2: còn lại bao nhiêu?",
        s: "5 - 2 = 3. Thứ tự đúng: hiểu đề trước, tính sau."
      },
      {
        k: "choice",
        q: "Đề mới: «Lan có 5 cái kẹo, cho Nam 2 cái. Hỏi NAM được mấy cái kẹo?». Câu trả lời là gì?",
        o: ["2","3","5"],
        a: 0,
        h: "Đọc kỹ chữ cuối: đề hỏi AI, và hỏi điều GÌ?",
        s: "Dữ kiện y hệt đề trước nhưng câu HỎI khác nên đáp án khác. Đề quen mà đọc lướt thì sai ngay."
      },
      {
        k: "choice",
        q: "Đề: «Chỉ đếm những quả táo ĐỎ trong hàng: 🍎 🍏 🍎 🍎 🍏». 🍎 là táo đỏ, 🍏 là táo xanh. Có mấy quả cần đếm?",
        o: ["3","5","2"],
        a: 0,
        h: "Gạch chân chữ 'chỉ' và chữ 'đỏ': chúng thu hẹp việc cần làm.",
        s: "ĐIỀU KIỆN (chỉ, trừ, lớn hơn, ít nhất, đầu tiên...) thu hẹp việc cần làm. Phải gạch chân chúng."
      },
      {
        k: "choice",
        q: "Đề: «Trong dãy 4, 9, 9, 2, tìm số lớn nhất và trả về VỊ TRÍ đầu tiên của nó, đếm từ 0.». Đáp án là gì?",
        o: ["1","2","9"],
        a: 0,
        h: "Có ba điều: hỏi vị trí chứ không hỏi giá trị; đếm từ 0; lấy cái đầu tiên (có hai số 9).",
        s: "Mỗi cụm chữ nhỏ là một yêu cầu: hỏi VỊ TRÍ (không phải giá trị), đếm từ 0, lấy cái ĐẦU TIÊN. Bỏ sót một cụm là sai."
      },
      {
        k: "choice",
        q: "Nói lại bằng lời mình. Đề: «Cho một danh sách số. Đếm xem có bao nhiêu số chẵn.». Cách nói lại nào ĐÚNG và đủ?",
        o: [
          "Đầu vào là một dãy số; đầu ra là MỘT con số: số lượng các số chẵn",
          "Đầu vào là một số; đầu ra là danh sách các số chẵn",
          "Đầu vào là một dãy số; đầu ra là tổng của các số chẵn"
        ],
        a: 0,
        h: "Đầu vào là gì, đầu ra là gì, và đầu ra là MỘT con số hay một danh sách?",
        s: "Nói lại theo mẫu 'đầu vào là ..., đầu ra là ...'. Hiểu sai ở bước này còn sửa dễ; code xong mới phát hiện thì tốn công hơn nhiều."
      },
      {
        k: "choice",
        q: "Đề: «Tìm số lớn thứ hai.» với danh sách [5, 5, 3]. Đề chưa nói rõ 'lớn thứ hai' tính hai số 5 là hai số khác nhau hay một. Bạn nên làm gì trước khi tính?",
        o: [
          "Hỏi lại, hoặc ghi rõ giả định mình chọn",
          "Chọn đại một cách rồi làm",
          "Bỏ qua vì chắc không quan trọng"
        ],
        a: 0,
        h: "Hai cách hiểu cho hai đáp án khác nhau (5 hoặc 3). Đoán thầm có an toàn không?",
        s: "Đề mơ hồ thì HỎI LẠI hoặc GHI RA giả định. Đoán thầm là nguồn lỗi lớn nhất vì không ai biết mình đã chọn gì."
      },
      {
        k: "input",
        q: "Thử ví dụ nhỏ để chắc mình hiểu đề: «Mỗi bạn nhận 2 cái kẹo. Có 4 bạn. Cần mua tổng cộng bao nhiêu cái kẹo?»",
        a: 8,
        h: "Vẽ nhanh: bạn 1 có 2, bạn 2 có 2... cộng lại.",
        s: "4 bạn x 2 cái = 8. Tính được ví dụ nhỏ bằng tay nghĩa là bạn hiểu đề."
      },
      {
        k: "choice",
        q: "Đề: «Cho một danh sách số. Hãy tìm số lớn nhất.» Đầu VÀO của đề là gì?",
        o: ["Một danh sách các số","Một số duy nhất","Số lớn nhất"],
        a: 0,
        h: "Đầu vào là thứ đề ĐƯA cho ta trước khi làm.",
        s: "Đầu vào = dữ kiện ban đầu: một danh sách số."
      },
      {
        k: "choice",
        q: "Vẫn đề đó. Đầu RA của đề là gì?",
        o: ["Một số duy nhất: số lớn nhất","Một danh sách các số","Vị trí của số lớn nhất"],
        a: 0,
        h: "Đầu ra là thứ đề MUỐN ta trả về.",
        s: "Đầu ra = kết quả: một con số (giá trị lớn nhất), không phải danh sách."
      },
      {
        k: "choice",
        q: "Đề: «Cho một danh sách số. Hãy tìm số lớn nhất.» Từ nào cho biết VIỆC ta phải làm?",
        o: ["tìm","cho","một"],
        a: 0,
        h: "Động từ là từ chỉ hành động: ta phải làm gì với dữ kiện?",
        s: "Động từ quan trọng là 'tìm': việc cần làm là tìm kiếm, không phải đếm hay sắp xếp."
      },
      {
        k: "choice",
        q: "Đề: «Cho một danh sách số. Hãy tìm số lớn nhất.» Đề đang nói về ĐỐI TƯỢNG nào?",
        o: ["Các số trong danh sách","Người ra đề","Máy tính"],
        a: 0,
        h: "Tự hỏi: đề bảo ta xử lý cái gì?",
        s: "Đối tượng là các số trong danh sách — mọi suy nghĩ đều xoay quanh chúng."
      },
      {
        k: "choice",
        q: "Đề: «Cho một danh sách số. Hãy tìm số lớn nhất.» Trường hợp đặc biệt nào CẦN nghĩ tới trước khi làm?",
        o: [
          "Danh sách rỗng, hoặc toàn số âm",
          "Danh sách có đúng 10 số",
          "Số lớn nhất luôn là số dương"
        ],
        a: 0,
        h: "Edge case: dữ kiện nào làm cách làm thông thường bị sai?",
        s: "Danh sách rỗng thì 'số lớn nhất' không tồn tại; toàn số âm thì không được bắt đầu từ 0. Nghĩ trước, khỏi sửa sau."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Chọn một đề ở trên. Nói lại bằng lời của bạn: đề CHO gì, đề HỎI gì, và có điều kiện nào cần gạch chân?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Bốn bước đọc đề, làm trước khi tính hay viết code:</b><br>1. <b>Đọc hai lần.</b> Lần một để hiểu chuyện gì đang xảy ra, lần hai để gạch chân.<br>2. <b>Gạch ba thứ:</b> đề <b>CHO</b> gì (dữ kiện), đề <b>HỎI</b> gì (điều phải tìm, thường ở câu có \"hỏi\", \"mấy\", \"bao nhiêu\", dấu ?), và có <b>ĐIỀU KIỆN</b> nào (chỉ, trừ, lớn hơn, ít nhất, đầu tiên, đếm từ 0...).<br>3. <b>Nói lại bằng lời của mình:</b> \"đầu vào là ..., đầu ra là ...\". Nói không trôi chảy nghĩa là chưa hiểu đề.<br>4. <b>Thử một ví dụ nhỏ</b> trước khi làm thật. Nếu đề mơ hồ thì <b>hỏi lại</b> hoặc <b>ghi ra giả định</b> mình chọn, không được đoán thầm.<br><b>Lỗi hay gặp:</b> đề quen nhưng câu HỎI khác một chữ, đáp án khác hẳn; bỏ sót điều kiện nhỏ như \"lớn hơn\" (khác \"ít nhất\"); trả lời vị trí thay vì giá trị.<br><b>Mở rộng:</b> 5. Xác định <b>đầu vào / đầu ra</b> (đề đưa gì, muốn trả gì). 6. Gạch <b>động từ</b> (việc phải làm: tìm, đếm, sắp xếp) và <b>đối tượng</b> (xử lý cái gì). 7. Liệt kê <b>trường hợp đặc biệt</b>: rỗng? số âm? trùng nhau? — nghĩ trước, khỏi sửa sau."
  }
];
