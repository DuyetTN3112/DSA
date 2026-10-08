/* Nội dung kiểm tra hiểu thật cho các bài lõi: mảng (a2, a3), đếm (cn), hàm (p4), dictionary (d1, d2),
   stack (stk), queue (que), tìm nhị phân (bs). Nạp sau probe-kinder.js, dùng helper fT/fC/fV/fPre/fR/KV. */
const pD = pDistinct, P3 = () => pD(3, 9);
PRB.a2 = {
  same: () => { const a = P3(), k = fR(0, 2); return fT(`${fPre(`a = [${a}]\nprint(a[${k}])`)}In ra số mấy?`, a[k], `Hộp chỉ số ${k} chứa ${a[k]}.`) },
  flip: () => { const a = P3(), k = fR(0, 2); return fT(`${fPre(`a = [${a}]\nprint(a[?])`)}Chương trình in ra ${a[k]}. Dấu ? là số nào?`, k, `${a[k]} nằm ở chỉ số ${k}.`) },
  new: () => { const a = P3(); return fT(`${fPre(`a = [${a}]\nprint(a[len(a) - 1])`)}In ra số mấy?`, a[2], "len(a) - 1 luôn là chỉ số hộp cuối.") },
  verdict: KV("Nam nói: 'mảng a có 5 phần tử thì a[5] là phần tử cuối'. Nam nói đúng hay sai?", "Nam nói: 'mảng a có 5 phần tử thì a[4] là phần tử cuối'. Nam nói đúng hay sai?", "Chỉ số bắt đầu từ 0 nên hộp cuối là chỉ số 4", "Chỉ số bắt đầu từ 1", "Mảng không có hộp cuối", "Sai: a[5] không tồn tại."),
  read: () => fC(`${fPre("a = [4, 8, 1]\nprint(a[3])")}Chuyện gì xảy ra?`, ["Báo lỗi IndexError: không có hộp chỉ số 3", "In ra 1", "In ra 0"], "Mảng 3 hộp chỉ có chỉ số 0, 1, 2.")
};
PRB.a3 = {
  same: () => { const a = P3(), k = fR(0, 2), v = fR(10, 19); return fT(`${fPre(`a = [${a}]\na[${k}] = ${v}\nprint(a[${k}])`)}In ra số mấy?`, v, `Hộp ${k} bị ghi đè bằng ${v}.`) },
  flip: () => { const a = P3(), k = fR(0, 2), v = fR(10, 19), b = a.slice(); b[k] = v; return fT(`${fPre(`a = [${a}]\na[?] = ${v}\nprint(a)`)}Chương trình in ra [${b}]. Dấu ? là số nào?`, k, `${v} xuất hiện ở chỉ số ${k}.`) },
  new: () => { const a = P3(), k = fR(0, 2), b = fR(2, 6); return fT(`${fPre(`a = [${a}]\na[${k}] = a[${k}] + ${b}\nprint(a[${k}])`)}In ra số mấy?`, a[k] + b, `Lấy ${a[k]} cũ cộng ${b}, rồi bỏ lại vào hộp.`) },
  verdict: KV("Hà nói: 'a[1] = 5 chèn thêm một hộp mới vào mảng'. Hà nói đúng hay sai?", "Hà nói: 'a[1] = 5 ghi đè hộp số 1, số hộp không đổi'. Hà nói đúng hay sai?", "Gán vào chỉ số có sẵn là ghi đè, không thêm hộp", "Gán luôn thêm hộp mới", "Gán xóa cả mảng", "Sai: số hộp không đổi."),
  read: () => fC(`${fPre("a = [4, 8, 1]\na[0] = 9\nprint(a)")}In ra gì?`, ["[9, 8, 1]", "[4, 9, 8, 1]", "[9]"], "Chỉ hộp 0 bị ghi đè.")
};
PRB.cn = {
  same: () => { const a = Array.from({ length: 5 }, () => fR(1, 3)), n = a.filter(x => x == 2).length; return fT(`${fPre(`a = [${a}]\nc = 0\nfor x in a:\n    if x == 2:\n        c = c + 1\nprint(c)`)}In ra số mấy?`, n, `Có ${n} số 2.`) },
  flip: () => { const x = fR(2, 6); return fT(`Mảng [${x}, ?, ${x}, 9]. Đếm số lần xuất hiện của ${x} cho kết quả 3. Dấu ? là số nào?`, x, `Cần thêm một số ${x} nữa.`) },
  new: () => { const a = Array.from({ length: 5 }, () => fR(1, 9)), n = a.filter(x => x % 2 == 0).length; return fT(`${fPre(`a = [${a}]\nc = 0\nfor x in a:\n    if x % 2 == 0:\n        c = c + 1\nprint(c)`)}In ra số mấy? (x % 2 == 0 nghĩa là x chẵn)`, n, `Có ${n} số chẵn.`) },
  verdict: KV("Dũng nói: 'muốn đếm số lần gặp thì nên đặt c = 1 lúc đầu'. Dũng nói đúng hay sai?", "Dũng nói: 'muốn đếm số lần gặp thì đặt c = 0 lúc đầu vì chưa gặp lần nào'. Dũng nói đúng hay sai?", "Chưa gặp lần nào thì số đếm là 0", "Đếm phải bắt đầu từ 1", "Giá trị đầu không ảnh hưởng", "Sai: c = 1 làm kết quả lớn hơn đúng 1."),
  read: () => fC("Mảng [2, 5, 2, 7]. Có bao nhiêu số KHÁC 2?", ["2", "4", "3"], "Số khác 2 là 5 và 7.")
};
PRB.p4 = {
  same: () => { const k = fR(2, 5), a = fR(1, 6); return fT(`${fPre(`def f(x):\n    return x * ${k}\nprint(f(${a}))`)}In ra số mấy?`, a * k, `${a} × ${k}.`) },
  flip: () => { const k = fR(2, 5), a = fR(1, 6); return fT(`${fPre(`def f(x):\n    return x + ${k}\nprint(f(?))`)}In ra ${a + k}. Dấu ? là số nào?`, a, `${a + k} - ${k} = ${a}.`) },
  new: () => fC(`${fPre("def f(x):\n    x * 2\nprint(f(3))")}In ra gì?`, ["None: hàm không trả gì ra", "6", "3"], "Thiếu return thì hàm trả về None."),
  verdict: KV("Lan nói: 'print và return giống nhau, đều đưa giá trị ra để dùng tiếp'. Lan nói đúng hay sai?", "Lan nói: 'return đưa giá trị ra để dùng tiếp, còn print chỉ hiển thị'. Lan nói đúng hay sai?", "Chỉ return mới trả giá trị cho nơi gọi hàm dùng tiếp", "print cũng trả giá trị về", "return chỉ để hiển thị", "Sai: print chỉ hiển thị."),
  read: () => fC(`${fPre('def f(x):\n    return x * 2\n    print("xong")\nf(3)')}Có in chữ xong không?`, ["Không, vì return đã kết thúc hàm", "Có", "Có, hai lần"], "Dòng sau return không bao giờ chạy.")
};
PRB.d1 = {
  same: () => { const x = fR(1, 9), y = fR(1, 9); return fT(`${fPre(`d = {"a": ${x}, "b": ${y}}\nprint(d["b"])`)}In ra số mấy?`, y, `Khóa "b" ứng với ${y}.`) },
  flip: () => { const x = fR(1, 4), y = fR(5, 9); return fC(`${fPre(`d = {"a": ${x}, "b": ${y}}\nprint(d[?])`)}Chương trình in ra ${x}. Dấu ? là gì?`, ['"a"', '"b"', `${x}`], `${x} thuộc khóa "a".`) },
  new: () => { const v = fR(10, 99); return fT(`${fPre(`d = {"a": 3}\nd["c"] = ${v}\nprint(d["c"])`)}In ra số mấy?`, v, "Gán vào khóa chưa có sẽ tạo mục mới.") },
  verdict: KV("Hà nói: 'd[1] lấy mục thứ hai của dict'. Hà nói đúng hay sai?", "Hà nói: 'dict tra theo khóa chứ không theo vị trí'. Hà nói đúng hay sai?", "Dict tìm theo khóa, không theo vị trí", "Dict tìm theo vị trí như list", "Dict không có khóa", "Sai: dict tra bằng khóa."),
  read: () => fC(`${fPre('d = {"a": 3}\nprint(d["b"])')}Chuyện gì xảy ra?`, ["Báo lỗi KeyError: không có khóa b", "In ra 0", "In ra None"], 'Khóa "b" chưa tồn tại.')
};
PRB.d2 = {
  same: () => { const s = Array.from({ length: 5 }, () => "ab"[fR(0, 1)]).join(""), n = [...s].filter(c => c == "a").length; return fT(`${fPre(`d = {}\nfor ch in "${s}":\n    d[ch] = d.get(ch, 0) + 1\nprint(d.get("a", 0))`)}In ra số mấy?`, n, `Có ${n} chữ a.`) },
  flip: () => { const k = fR(1, 4), m = fR(1, 4); return fT(`Sau khi đếm một chuỗi chỉ gồm a và b, d["a"] là ${k} và d["b"] là ${m}. Chuỗi có tất cả bao nhiêu ký tự?`, k + m, `${k} + ${m}.`) },
  new: () => { const v = fR(2, 9); return fT(`${fPre(`d = {}\nprint(d.get("z", ${v}))`)}In ra số mấy?`, v, "Khóa z chưa có nên get trả giá trị mặc định.") },
  verdict: KV('Hà nói: \'d.get("a", 0) báo lỗi nếu chưa có khóa a\'. Hà nói đúng hay sai?', 'Hà nói: \'d.get("a", 0) trả về 0 nếu chưa có khóa a\'. Hà nói đúng hay sai?', "get có giá trị mặc định nên không báo lỗi", "get luôn báo lỗi khi thiếu khóa", "get xóa khóa", "Sai: nó trả về 0."),
  read: () => fC(`${fPre('d = {}\nd["a"] = d.get("a", 0) + 1\nd["a"] = d.get("a", 0) + 1\nprint(d["a"])')}In ra số mấy?`, ["2", "1", "0"], "Hai lần cộng 1.")
};
PRB.stk = {
  same: () => { const a = P3(); return fT(`${fPre(`push(${a[0]})\npush(${a[1]})\npush(${a[2]})\npop()`)}pop() trả về số mấy?`, a[2], "Vào sau ra trước: lấy số vừa push sau cùng.") },
  flip: () => { const a = P3(); return fT(`Có 3 số được push, rồi pop() ba lần liên tiếp trả về ${a[2]}, ${a[1]}, ${a[0]}. Số nào được push ĐẦU TIÊN?`, a[0], "Số ra sau cùng là số vào đầu tiên.") },
  new: () => fC('Soạn văn bản: gõ "A", gõ "B", gõ "C". Bấm Undo một lần. Thao tác nào bị hoàn tác?', ['Gõ "C"', 'Gõ "A"', 'Gõ "B"'], "Undo hoàn tác thao tác gần nhất: stack."),
  verdict: KV("Nam nói: 'stack lấy ra phần tử vào ĐẦU TIÊN trước'. Nam nói đúng hay sai?", "Nam nói: 'stack lấy ra phần tử vào SAU CÙNG trước'. Nam nói đúng hay sai?", "Stack vào sau ra trước, như chồng đĩa", "Stack vào trước ra trước", "Stack lấy ngẫu nhiên", "Sai: vào sau ra trước."),
  read: () => fC("push(1), push(2), pop(), push(3). Bây giờ phần tử trên cùng của stack là gì?", ["3", "2", "1"], "Sau pop còn 1, push 3 thì 3 nằm trên cùng.")
};
PRB.que = {
  same: () => { const a = P3(); return fT(`${fPre(`enqueue(${a[0]})\nenqueue(${a[1]})\nenqueue(${a[2]})\ndequeue()`)}dequeue() trả về số mấy?`, a[0], "Vào trước ra trước.") },
  flip: () => { const a = P3(); return fT(`Có 3 số được enqueue, rồi dequeue() ba lần liên tiếp trả về ${a[0]}, ${a[1]}, ${a[2]}. Số nào được enqueue SAU CÙNG?`, a[2], "Số ra sau cùng là số vào sau cùng.") },
  new: () => fC("Xếp hàng mua vé: An, Bình, Chi đến lần lượt. Ai được phục vụ trước?", ["An", "Chi", "Bình"], "Queue: ai đến trước phục vụ trước."),
  verdict: KV("Nam nói: 'queue lấy ra phần tử vào SAU CÙNG trước'. Nam nói đúng hay sai?", "Nam nói: 'queue lấy ra phần tử vào ĐẦU TIÊN trước'. Nam nói đúng hay sai?", "Queue vào trước ra trước, như xếp hàng", "Queue vào sau ra trước", "Queue lấy ngẫu nhiên", "Sai: vào trước ra trước."),
  read: () => fC("enqueue(1), enqueue(2), dequeue(), enqueue(3). Phần tử sẽ ra TIẾP THEO là gì?", ["2", "3", "1"], "Sau dequeue còn 2, rồi 3 xếp sau 2.")
};
PRB.bs = {
  same: () => { const lo = fR(0, 3), hi = fR(6, 12); return fT(`Mảng đã sắp xếp, chỉ số từ ${lo} đến ${hi}. Hộp giữa có chỉ số (${lo} + ${hi}) // 2 bằng mấy?`, Math.floor((lo + hi) / 2), "// là chia lấy phần nguyên.") },
  flip: () => { const m = fR(2, 6); return fT(`Khoảng chỉ số từ 0 đến hi (hi chẵn) có hộp giữa là chỉ số ${m}. hi bằng mấy?`, 2 * m, `(0 + ${2 * m}) // 2 = ${m}.`) },
  new: () => { const k = fR(2, 5); return fT(`Mỗi lần so sánh loại bỏ một nửa số hộp. Từ ${2 ** k} hộp, sau ${k} lần so sánh còn mấy hộp?`, 1, "Chia đôi liên tục thì rất nhanh: log2 của số hộp.") },
  verdict: KV("Nam nói: 'tìm nhị phân dùng được trên mảng chưa sắp xếp'. Nam nói đúng hay sai?", "Nam nói: 'tìm nhị phân chỉ đúng khi mảng đã sắp xếp'. Nam nói đúng hay sai?", "Bỏ một nửa chỉ an toàn khi biết thứ tự", "Thứ tự không quan trọng", "Nhị phân tự sắp xếp mảng", "Sai: cần mảng đã sắp xếp."),
  read: () => fC("Mảng [1, 3, 5, 7, 9, 11, 13] đã sắp xếp. Tìm 11. Hộp giữa chứa 7. Bỏ nửa nào?", ["Bỏ nửa trái, vì 11 lớn hơn 7", "Bỏ nửa phải", "Không bỏ nửa nào"], "11 > 7 nên 11 chỉ có thể ở bên phải.")
};
Object.assign(PREQ, { p4: ["p1"], a2: ["l1"], a3: ["a2"], sm: ["p3", "a2"], cn: ["p2", "p3", "a2"], d1: ["a3"], d2: ["d1", "cn"], stk: ["a3"], que: ["stk"], bs: ["l2", "a2"] });
