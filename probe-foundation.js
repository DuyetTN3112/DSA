/* Nội dung kiểm tra hiểu thật cho các bài nền gốc (nạp sau probe.js).
   Thêm bài: PRB.<id> = {same, flip, new, verdict, read}; khai tiền đề: Object.assign(PREQ, {...}).
   Quy ước: T = đáp án là số; C = chọn đáp án (phần tử đầu là đúng, app tự xáo); V = đúng/sai (ngẫu nhiên mệnh đề đúng hoặc sai, kèm lý do). */
const fT = (q, a, w) => ({ q, a, w });
const fC = (q, o, w) => ({ q, o, a: 0, w });
const fPre = s => `<pre>${s}</pre>`;
const fV = (f, t, rf, rt, d1, d2, wf, wt) => () => Math.random() < 0.5 ? { q: t, o: pYN, a: 0, w: wt, why: why(rt, d1, d2) } : { q: f, o: pYN, a: 1, w: wf, why: why(rf, d1, d2) };
const fVT = (t, rt, d1, d2, wt) => () => ({ q: t, o: pYN, a: 0, w: wt, why: why(rt, d1, d2) });
const fR = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

PRB.bx0 = {
  same: () => { const a = fR(1, 4), b = fR(1, 4); return fC(`Chọn cách viết ĐÚNG THỨ TỰ cho "${a} cộng ${b} bằng ${a + b}":`, [`${a} + ${b} = ${a + b}`, `${a} ${b} + = ${a + b}`, `+ ${a} ${b} = ${a + b}`], "Thứ tự quen thuộc: số, dấu, số, dấu bằng, kết quả.") },
  flip: () => { const a = fR(4, 8), b = fR(1, 3); return fC(`Chọn cách viết đúng cho "${a} trừ ${b} bằng ${a - b}":`, [`${a} - ${b} = ${a - b}`, `${a} = ${b} - ${a - b}`, `${b} - ${a} = ${a - b}`], "Số bị trừ đứng trước dấu trừ, kết quả đứng sau dấu bằng.") },
  new: () => { const n = fR(2, 9); return fC(`Trong Python, viết "bỏ số ${n} vào hộp tên y":`, [`y = ${n}`, `${n} = y`, `y ${n} =`], "Tên hộp bên trái, dấu =, giá trị bên phải.") },
  verdict: fV("Lan viết 1 + 1 = 3 và nói: 'mình viết đúng thứ tự nên là đúng'. Lan nói đúng hay sai?", "Lan viết 2 + 2 = 4 và nói: 'vừa viết đúng thứ tự, vừa tính đúng'. Lan nói đúng hay sai?", "Đúng thứ tự viết khác với đúng kết quả: 1 + 1 phải bằng 2", "Cả cách viết lẫn phép tính đều đúng", "Viết đúng thứ tự thì kết quả luôn đúng", "Kết quả không quan trọng", "Sai: viết đúng thứ tự chưa chắc đúng kết quả.", "Đúng: viết đúng và tính đúng."),
  read: () => fC(`Một bạn viết "${fR(2, 4)} + 3 = 9". Bạn ấy đã sai ở đâu?`, ["Thứ tự viết đúng, nhưng kết quả sai", "Thứ tự viết sai", "Cả hai đều sai"], "Hình thức đúng nhưng ý nghĩa sai: phải kiểm tra cả hai.")
};
PRB.p1 = {
  same: () => { const a = fR(1, 9), b = fR(1, 9); return fT(`${fPre(`x = ${a}\nx = ${b}\nprint(x)`)}In ra số mấy?`, b, "Dòng sau ghi đè dòng trước: hộp x giờ chứa " + b + ".") },
  flip: () => { const k = fR(2, 6); return fT(`${fPre(`x = 3\nx = x + ?\nprint(x)`)}Chương trình in ra ${3 + k}. Dấu ? là số nào?`, k, `3 + ${k} = ${3 + k}.`) },
  new: () => { const a = fR(1, 4), b = fR(5, 9); return fT(`${fPre(`x = ${a}\ny = x\nx = ${b}\nprint(y)`)}In ra số mấy?`, a, `y chép giá trị của x lúc đó (${a}); x đổi sau này không làm y đổi.`) },
  verdict: fV("Nam nói: 'x = x + 1 là vô lý vì x không thể bằng x + 1'. Nam nói đúng hay sai?", "Nam nói: 'dòng x = 5 nghĩa là bỏ số 5 vào hộp tên x'. Nam nói đúng hay sai?", "Dấu = trong lập trình là bỏ giá trị vào hộp, không phải so sánh", "Dấu = trong lập trình là bỏ giá trị vào hộp", "Mọi dòng có dấu = đều là phương trình toán", "Hộp x không thể đổi giá trị", "Sai: x = x + 1 nghĩa là lấy x hiện tại, cộng 1, rồi bỏ lại vào x.", "Đúng."),
  read: () => fC(`${fPre(`x = ${fR(2, 9)}\nprint("x")`)}Dòng print in ra gì?`, ["Chữ x", "Số đang nằm trong hộp x", "Lỗi"], 'Có dấu ngoặc kép thì đó là chữ "x", không phải hộp x.')
};
PRB.p2 = {
  same: () => { const a = fR(1, 9), b = fR(1, 9); return fC(`${fPre(`if ${a} > ${b}:\n    print("A")\nelse:\n    print("B")`)}In ra chữ nào?`, a > b ? ["A", "B", "Không in gì"] : ["B", "A", "Không in gì"], `${a} > ${b} là ${a > b ? "đúng nên in A" : "sai nên in B"}.`) },
  flip: () => { const b = fR(2, 8); return fT(`${fPre(`a = ?\nif a > ${b}:\n    print("A")`)}Số nguyên nhỏ nhất của ? để in ra A là mấy?`, b + 1, `Phải lớn hơn ${b} thật sự, nên nhỏ nhất là ${b + 1}.`) },
  new: () => { const d = [4, 5, 6][fR(0, 2)], ok = d >= 5; return fC(`Luật: nếu điểm >= 5 thì "Đạt", nếu không thì "Trượt". Điểm ${d} thì kết quả là gì?`, ok ? ["Đạt", "Trượt", "Không đủ thông tin"] : ["Trượt", "Đạt", "Không đủ thông tin"], `${d} ${ok ? "đạt" : "chưa đạt"} điều kiện >= 5.`) },
  verdict: fV("Hà nói: 'if a > b và if a >= b luôn cho kết quả giống nhau'. Hà nói đúng hay sai?", "Hà nói: 'if a > b và if a >= b cho kết quả khác nhau khi a bằng b'. Hà nói đúng hay sai?", "Khi a bằng b, > là sai còn >= là đúng", "Khi a bằng b, > là sai còn >= là đúng", "Chúng luôn giống nhau", "Chúng khác nhau với mọi giá trị", "Sai: khác nhau đúng ở trường hợp bằng nhau.", "Đúng."),
  read: () => fC(`${fPre(`if 2 > 5:\n    print("A")\nprint("B")`)}In ra gì?`, ["B", "A rồi B", "A"], 'Dòng print("B") không thụt vào nên nó không thuộc if: luôn chạy.')
};
PRB.p3 = {
  same: () => { const n = fR(3, 8); return fT(`${fPre(`for i in range(${n}):\n    print(i)`)}Dòng cuối cùng in ra số mấy?`, n - 1, `range(${n}) chạy 0 đến ${n - 1}.`) },
  flip: () => { const k = fR(2, 6); return fT(`Muốn in các số 0, 1, ..., ${k} thì viết range(?). Dấu ? là số nào?`, k + 1, `range dừng TRƯỚC số cuối, nên cần ${k + 1}.`) },
  new: () => { const n = fR(2, 6), m = fR(2, 5); return fT(`${fPre(`t = 0\nfor i in range(${n}):\n    t = t + ${m}\nprint(t)`)}In ra số mấy?`, n * m, `Lặp ${n} lần, mỗi lần thêm ${m}: ${n * m}.`) },
  verdict: fV("Dũng nói: 'range(5) in ra các số từ 1 đến 5'. Dũng nói đúng hay sai?", "Dũng nói: 'range(5) in ra các số từ 0 đến 4'. Dũng nói đúng hay sai?", "range(5) bắt đầu từ 0 và dừng trước 5", "range(5) bắt đầu từ 0 và dừng trước 5", "range(5) bắt đầu từ 1", "range(5) dừng đúng ở 5", "Sai: là 0, 1, 2, 3, 4.", "Đúng."),
  read: () => fC(`${fPre(`for i in range(3):\n    print("i")`)}Dòng đầu tiên in ra gì?`, ["Chữ i", "0", "1"], 'Có ngoặc kép nên in đúng chữ "i", ba lần.')
};
PRB.sm = {
  same: () => { const a = [fR(1, 9), fR(1, 9), fR(1, 9)], s = a[0] + a[1] + a[2]; return fT(`${fPre(`a = [${a}]\nt = 0\nfor x in a:\n    t = t + x\nprint(t)`)}In ra số mấy?`, s, `Cộng dồn ${a.join(" + ")} = ${s}.`) },
  flip: () => { const a = fR(1, 5), c = fR(1, 5), m = fR(1, 6); return fT(`${fPre(`a = [${a}, ?, ${c}]\nt = 0\nfor x in a:\n    t = t + x\nprint(t)`)}Chương trình in ra ${a + c + m}. Số còn thiếu ? là mấy?`, m, `${a + c + m} - ${a} - ${c} = ${m}.`) },
  new: () => { const a = [fR(1, 5), fR(1, 5), fR(1, 5)], s = 10 + a[0] + a[1] + a[2]; return fT(`${fPre(`a = [${a}]\nt = 10\nfor x in a:\n    t = t + x\nprint(t)`)}In ra số mấy?`, s, `Bắt đầu từ 10 chứ không phải 0: ${s}.`) },
  verdict: fV("Dũng nói: 'đặt t = 1 rồi cộng dồn thì vẫn ra tổng đúng'. Dũng nói đúng hay sai?", "Dũng nói: 'đặt t = 0 trước vòng lặp rồi cộng dồn thì ra tổng đúng'. Dũng nói đúng hay sai?", "Giá trị khởi tạo được cộng vào kết quả, nên phải là 0", "Giá trị khởi tạo được cộng vào kết quả, nên phải là 0", "t = 1 không ảnh hưởng gì", "Khởi tạo bằng số nào cũng được", "Sai: t = 1 làm tổng lớn hơn đúng 1.", "Đúng."),
  read: () => { const n = fR(3, 5); return fC(`${fPre(`a = [${Array.from({ length: n }, () => fR(1, 9))}]\nt = 0\nfor x in a:\n    t = t + x\n    print(t)`)}Có bao nhiêu dòng được in ra?`, [`${n}`, "1", `${n + 1}`], 'print thụt vào nằm TRONG vòng lặp nên in mỗi lần lặp.') }
};
/* Phát hiện sau review: verdict của l1 đến l3 luôn là mệnh đề sai, người học đoán "Sai" là qua. Thêm mệnh đề ĐÚNG. */
bank("l1", "verdict", [fVT('Mai nói: "Mảng 6 hộp có các chỉ số từ 0 đến 5". Mai nói đúng hay sai?', "Máy đếm từ 0 nên hộp cuối có chỉ số 5", "Chỉ số bắt đầu từ 1", "Mảng không có chỉ số", "Đúng.")]);
bank("l2", "verdict", [fVT('Tuấn nói: "Mảng chưa sắp xếp, muốn chắc là không có số 9 thì phải mở hết các hộp". Tuấn nói đúng hay sai?', "Hộp chưa mở vẫn có thể chứa số 9", "Mở nửa số hộp là đủ", "Không cần mở hộp nào", "Đúng.")]);
bank("l3", "verdict", [fVT('Hà nói: "Nên lấy hộp đầu tiên làm mốc cho giấy nhớ, rồi so với các hộp còn lại". Hà nói đúng hay sai?', "Hộp đầu là số có thật trong mảng nên không bao giờ sai mốc", "Mốc luôn phải bằng 0", "Mốc không quan trọng", "Đúng.")]);
Object.assign(PREQ, { p1: ["bx0"], p2: ["p1"], p3: ["p1", "p2"], sm: ["p3"], l3: ["l1", "l2", "sm"] });
