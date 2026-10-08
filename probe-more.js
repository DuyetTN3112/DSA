/* Nội dung kiểm tra hiểu thật: Mẫu giáo còn lại (k2, k5, k8, k9), hai con trỏ (tp), nổi bọt (bub), hash map (h1, h2, h3).
   Nạp sau probe-core.js. */
const bubPass = a => { a = a.slice(); for (let i = 0; i < a.length - 1; i++) if (a[i] > a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]]; return a };
const others = (all, right) => [right, ...all.filter(x => x != right)];
PRB.k2 = {
  same: () => { const a = fR(1, 7), b = fR(1, 7), ans = a > b ? "Bên trái nhiều hơn" : a < b ? "Bên phải nhiều hơn" : "Bằng nhau"; return fC(`${"🍎".repeat(a)}  và  ${"🍎".repeat(b)}. Bên nào nhiều hơn?`, others(["Bên trái nhiều hơn", "Bên phải nhiều hơn", "Bằng nhau"], ans), "Đếm từng bên rồi so số.") },
  flip: () => { const a = fR(4, 8); return fT(`Bên trái có ${a} quả. Bên phải có ÍT hơn ${a} quả, nhưng có NHIỀU hơn ${a - 2} quả (so với con số ${a - 2}, không phải so với bên trái). Bên phải có mấy quả?`, a - 1, `Cần số nhỏ hơn ${a} và lớn hơn ${a - 2}. Chỉ có ${a - 1}.`) },
  new: () => { const a = fR(2, 9), b = fR(2, 9), s = a == b ? b + 1 : b, r = a < s ? "Lan" : "Mai"; return fC(`Lan có ${a} kẹo, Mai có ${s} kẹo. Ai có ÍT kẹo hơn?`, [r, r == "Lan" ? "Mai" : "Lan", "Bằng nhau"], "Số nhỏ hơn là ít hơn.") },
  verdict: KV("Hà nói: 'nhóm có đồ vật to hơn thì có nhiều hơn'. Hà nói đúng hay sai?", "Hà nói: 'nhiều hay ít chỉ phụ thuộc số lượng, không phụ thuộc to hay nhỏ'. Hà nói đúng hay sai?", "Nhiều hay ít chỉ phụ thuộc số lượng", "Vật to thì luôn nhiều hơn", "Vật nhỏ thì luôn nhiều hơn", "Sai: so sánh bằng số lượng."),
  read: () => { const a = fR(4, 7), b = fR(1, 3); return fC(`${"🍎".repeat(a)}  và  ${"🍌".repeat(b)}. Bên nào ÍT hơn?`, ["Bên chuối", "Bên táo", "Bằng nhau"], "Đề hỏi ÍT hơn, không phải nhiều hơn.") }
};
PRB.k5 = {
  same: () => { const a = fR(1, 5), b = fR(1, 5); return fT(`Người máy làm đúng từng lệnh theo thứ tự: "đi ${a} bước", "quay phải", "đi ${b} bước". Tổng cộng máy đã đi bao nhiêu bước?`, a + b, `${a} + ${b}; quay phải không phải là bước đi.`) },
  flip: () => { const a = fR(1, 5), b = fR(1, 5); return fT(`Người máy đi tổng cộng ${a + b} bước. Lệnh 1: đi ${a} bước. Lệnh 2: quay phải. Lệnh 3: đi ? bước. Dấu ? là mấy?`, b, `${a + b} - ${a} = ${b}.`) },
  new: () => { const x = fR(3, 6); return fT(`Hộp chứa ${x}. Lệnh 1: bỏ thêm 3. Lệnh 2: lấy ra 2. Lệnh 3: bỏ thêm 4. Sau lệnh 3 hộp chứa mấy?`, x + 5, `${x} + 3 - 2 + 4 = ${x + 5}.`) },
  verdict: KV("Nam nói: 'người máy tự hiểu ý em dù lệnh thiếu chi tiết'. Nam nói đúng hay sai?", "Nam nói: 'người máy chỉ làm đúng từng lệnh em đưa'. Nam nói đúng hay sai?", "Máy không đoán ý, chỉ làm đúng chữ trong lệnh", "Máy luôn đoán được ý", "Máy làm nhiều hơn lệnh", "Sai: máy chỉ làm đúng lệnh."),
  read: () => fC('Lệnh 1: đi 2 bước. Lệnh 2: quay phải. Ngay sau khi làm xong lệnh 1, máy đã quay phải chưa?', ["Chưa, quay phải là lệnh sau", "Rồi", "Không đủ thông tin"], "Máy làm từng lệnh theo thứ tự.")
};
PRB.k8 = {
  same: () => { const p = [["🔴", "🔵"], ["⭐", "🌙"], ["🍎", "🍌"]][fR(0, 2)], L = fR(3, 6), seq = Array.from({ length: L }, (_, i) => p[i % 2]), nx = p[L % 2]; return fC(`${seq.join(" ")} ?  Hình tiếp theo là gì?`, [nx, p[(L + 1) % 2], "Không đoán được"], "Hai hình thay phiên nhau.") },
  flip: () => { const p = [["🔴", "🔵"], ["⭐", "🌙"]][fR(0, 1)], k = fR(5, 12), r = p[(k - 1) % 2]; return fC(`Dãy lặp ${p[0]} ${p[1]} ${p[0]} ${p[1]} ... Hình thứ ${k} (đếm từ 1) là gì?`, [r, r == p[0] ? p[1] : p[0], "Không đoán được"], `Vị trí lẻ là ${p[0]}, chẵn là ${p[1]}.`) },
  new: () => { const a = fR(1, 5), s = fR(2, 4); return fT(`Dãy số: ${a}, ${a + s}, ${a + 2 * s}, ${a + 3 * s}, ?  Số tiếp theo là mấy?`, a + 4 * s, `Mỗi số hơn số trước ${s}.`) },
  verdict: KV("Hà nói: 'nhìn 3 hình đầu là chắc chắn biết hết quy luật'. Hà nói đúng hay sai?", "Hà nói: 'nhìn vài hình đầu mới chỉ là đoán quy luật, cần kiểm tra thêm'. Hà nói đúng hay sai?", "Vài ví dụ chỉ cho ta một phỏng đoán cần kiểm tra", "Ba ví dụ luôn đủ để chắc chắn", "Quy luật không tồn tại", "Sai: đó mới là phỏng đoán."),
  read: () => fC("⭐ ⭐ 🌙 ⭐ ⭐ 🌙 ⭐ ⭐ ?  Hình tiếp theo là gì?", ["🌙", "⭐", "Không đoán được"], "Quy luật lặp lại sau mỗi 3 hình, không phải 2.")
};
PRB.k9 = {
  same: () => { const a = fR(1, 9); return fT(`${fPre(`x = ${a}\nprint(x)`)}Máy in ra số mấy?`, a, `Hộp x chứa ${a}.`) },
  flip: () => { const a = fR(1, 9); return fT(`${fPre("x = ?\nprint(x)")}Máy in ra ${a}. Dấu ? là số nào?`, a, `Hộp x phải chứa ${a}.`) },
  new: () => { const a = fR(1, 5), b = fR(1, 5); return fT(`${fPre(`a = ${a}\nb = ${b}\nprint(a + b)`)}Máy in ra số mấy?`, a + b, `${a} + ${b}.`) },
  verdict: KV("Nam nói: 'print(x) in ra chữ x'. Nam nói đúng hay sai?", "Nam nói: 'print(x) in ra thứ đang nằm trong hộp x'. Nam nói đúng hay sai?", "print(x) in thứ đang nằm TRONG hộp tên x", "print(x) in ra tên hộp", "print luôn in chữ", "Sai: in giá trị trong hộp."),
  read: () => fC(`${fPre("n = 4\nprint(n + 1)\nprint(n)")}Dòng thứ hai được in ra là gì?`, ["4", "5", "n"], "print(n + 1) chỉ tính tạm, không đổi hộp n.")
};
PRB.tp = {
  same: () => { const n = fR(4, 8); return fT(`Mảng a có ${n} hộp. i = 0, j = len(a) - 1. j bằng mấy?`, n - 1, `len(a) - 1 = ${n - 1}.`) },
  flip: () => { const j = fR(3, 8); return fT(`j = len(a) - 1 và j bằng ${j}. Mảng a có bao nhiêu hộp?`, j + 1, `${j} + 1.`) },
  new: () => { const a = pDistinct(4, 9); return fT(`${fPre(`a = [${a}]\ni = 0\nj = 3\na[i], a[j] = a[j], a[i]\nprint(a[i])`)}In ra số mấy?`, a[3], "Sau khi đổi chỗ, hộp 0 chứa số cũ của hộp 3.") },
  verdict: KV("Nam nói: 'hai con trỏ i và j luôn cùng đi sang phải'. Nam nói đúng hay sai?", "Nam nói: 'trong bài trái-phải, i đi sang phải còn j đi sang trái rồi gặp nhau ở giữa'. Nam nói đúng hay sai?", "i bắt đầu từ đầu đi sang phải, j bắt đầu từ cuối đi sang trái", "Cả hai luôn đi sang phải", "Cả hai đứng yên", "Sai: chúng đi ngược chiều."),
  read: () => fC("Mảng có 5 hộp. i = 0, j = 4. Sau một bước (i tăng 1, j giảm 1) thì i và j bằng bao nhiêu?", ["i = 1, j = 3", "i = 1, j = 5", "i = 0, j = 3"], "i: 0 thành 1; j: 4 thành 3.")
};
PRB.bub = {
  same: () => { const a = pDistinct(3, 9), m = Math.max(...a); return fT(`${fPre(`a = [${a}]  # một lượt nổi bọt: so sánh cặp (0,1), rồi (1,2), nếu trái lớn hơn phải thì đổi chỗ`)}Sau một lượt, hộp cuối cùng chứa số mấy?`, m, "Số lớn nhất bị đẩy dần về cuối.") },
  flip: () => { const m = fR(5, 9); return fT(`Sau một lượt nổi bọt, hộp cuối chứa ${m}. Số lớn nhất của mảng ban đầu là mấy?`, m, "Một lượt luôn đẩy số lớn nhất về cuối.") },
  new: () => { const a = pDistinct(3, 9), r = bubPass(a); return fT(`${fPre(`a = [${a}]  # một lượt nổi bọt: so sánh cặp (0,1), rồi (1,2), nếu trái lớn hơn phải thì đổi chỗ`)}Sau một lượt, hộp đầu tiên chứa số mấy?`, r[0], `Kết quả sau một lượt là [${r}].`) },
  verdict: KV("Hà nói: 'sau một lượt nổi bọt, cả mảng đã sắp xếp xong'. Hà nói đúng hay sai?", "Hà nói: 'sau một lượt nổi bọt, số lớn nhất chắc chắn ở cuối nhưng mảng chưa chắc đã xong'. Hà nói đúng hay sai?", "Một lượt chỉ đảm bảo số lớn nhất về cuối", "Một lượt luôn đủ để sắp xếp cả mảng", "Một lượt xóa các số nhỏ", "Sai: mới chắc chắn số lớn nhất về cuối."),
  read: () => fC("a = [3, 1, 2]. So sánh hai hộp đầu: 3 > 1 nên đổi chỗ. Ngay bây giờ mảng là gì?", ["[1, 3, 2]", "[3, 1, 2]", "[1, 2, 3]"], "Mới đổi một cặp, chưa làm hết lượt.")
};
PRB.h1 = {
  same: () => { const a = fR(8, 15), b = fR(8, 15); return fT(`${fPre(`tuoi = {"An": ${a}, "Binh": ${b}}\nprint(tuoi["Binh"])`)}In ra số mấy?`, b, `Khóa "Binh" ứng với ${b}.`) },
  flip: () => { const a = fR(8, 11), b = fR(12, 15); return fC(`${fPre(`tuoi = {"An": ${a}, "Binh": ${b}}\nprint(tuoi[?])`)}In ra ${a}. Dấu ? là gì?`, ['"An"', '"Binh"', `${a}`], `${a} thuộc khóa "An".`) },
  new: () => { const a = fR(8, 15); return fT(`${fPre(`tuoi = {"An": ${a}}\ntuoi["An"] = tuoi["An"] + 1\nprint(tuoi["An"])`)}In ra số mấy?`, a + 1, `Lấy ${a}, cộng 1, bỏ lại vào khóa "An".`) },
  verdict: KV('Hà nói: \'tuoi["An"] lấy mục đầu tiên của dict\'. Hà nói đúng hay sai?', "Hà nói: 'dict tra bằng khóa chứ không bằng vị trí'. Hà nói đúng hay sai?", "Dict tìm theo khóa, không theo vị trí", "Dict tìm theo vị trí", "Dict không có khóa", "Sai: tra bằng khóa."),
  read: () => fC(`${fPre('tuoi = {"An": 10}\nprint(tuoi["an"])')}Chuyện gì xảy ra?`, ["Báo lỗi KeyError: khóa phân biệt chữ hoa, chữ thường", "In ra 10", "In ra None"], '"an" và "An" là hai khóa khác nhau.')
};
PRB.h2 = {
  same: () => { const n = fR(2, 5); return fT(`${fPre(`d = {}\nd["a"] = 1\n${'d["a"] = d["a"] + 1\n'.repeat(n - 1)}print(d["a"])`)}In ra số mấy?`, n, `Bắt đầu 1, cộng ${n - 1} lần.`) },
  flip: () => { const n = fR(2, 6); return fT(`Một chữ xuất hiện ${n} lần trong chuỗi. Đếm bằng d[ch] = d.get(ch, 0) + 1 cho mỗi lần gặp. Cuối cùng d[ch] bằng mấy?`, n, `Mỗi lần gặp cộng 1: ${n}.`) },
  new: () => { const k = "xyz"[fR(0, 2)]; return fT(`${fPre(`d = {}\nd["${k}"] = d.get("${k}", 0) + 1\nprint(d["${k}"])`)}In ra số mấy?`, 1, "Chưa có khóa nên get trả 0, rồi cộng 1.") },
  verdict: KV('Hà nói: \'d["x"] = d["x"] + 1 chạy được cả khi chưa có khóa x\'. Hà nói đúng hay sai?', 'Hà nói: \'d["x"] = d["x"] + 1 báo lỗi nếu chưa có khóa x\'. Hà nói đúng hay sai?', 'Phải có khóa x trước thì d["x"] mới lấy ra được', "Khóa tự được tạo khi đọc", "Python tự đặt bằng 0", "Sai: báo lỗi KeyError."),
  read: () => fC(`${fPre('d = {}\nprint(d["x"])')}Chuyện gì xảy ra?`, ["Báo lỗi KeyError", "In ra 0", "In ra None"], "Đọc khóa chưa có thì báo lỗi.")
};
PRB.h3 = {
  same: () => { const n = fR(10, 99) * 10; return fT(`Tìm một số trong list ${n} phần tử (chưa sắp xếp). Tệ nhất phải mở tối đa bao nhiêu hộp?`, n, "Phải duyệt hết.") },
  flip: () => { const n = fR(10, 99) * 10; return fT(`Tra một khóa trong dict có ${n} cặp mất khoảng bao nhiêu bước (xấp xỉ, không phụ thuộc số cặp)?`, 1, "Dict tra gần như một bước.") },
  new: () => fC("Muốn kiểm tra 'đã gặp số này chưa' nhanh nhất cho 1 triệu số, nên dùng gì?", ["Set hoặc dict", "List và duyệt từng phần tử", "Sắp xếp lại mỗi lần"], "Tra bằng bảng băm gần như một bước."),
  verdict: KV("Hà nói: 'dict nhanh hơn list và không tốn thêm bộ nhớ'. Hà nói đúng hay sai?", "Hà nói: 'dict nhanh hơn nhưng đổi lại tốn thêm bộ nhớ'. Hà nói đúng hay sai?", "Tốc độ có được là nhờ bỏ thêm bộ nhớ để nhớ vị trí", "Dict không tốn bộ nhớ", "List tốn nhiều bộ nhớ hơn dict", "Sai: đổi bộ nhớ lấy tốc độ."),
  read: () => fC("Danh sách chỉ có 5 phần tử. Duyệt hết list hay tra dict, cái nào nhanh hơn rõ rệt?", ["Gần như không khác nhau, vì n quá nhỏ", "Dict nhanh hơn gấp nhiều lần", "List nhanh hơn nhiều"], "Khác biệt chỉ rõ khi n lớn.")
};
Object.assign(PREQ, { k2: ["k1"], k5: ["k4"], k8: ["k2"], k9: ["k5", "k4"], bx0: ["k4", "k9"], tp: ["a3", "p3"], bub: ["a3", "p2"], h1: ["d1"], h2: ["h1", "d2"], h3: ["h2", "l2"] });
