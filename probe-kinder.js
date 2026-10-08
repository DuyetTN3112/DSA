/* Nội dung kiểm tra hiểu thật cho phần Mẫu giáo (nạp sau probe-foundation.js).
   Chọn các bài là GỐC của chuỗi tiền đề: đếm (k1), thứ tự từ 0 (k3), tên và hộp (k4), nếu-thì (k6), lặp và dừng (k7).
   Chưa có: k2, k5, k8, k9. */
const KV = (f, t, rf, d1, d2, wf) => fV(f, t, rf, rf, d1, d2, wf, "Đúng.");
PRB.k1 = {
  same: () => { const n = fR(3, 9); return fT(`Có bao nhiêu quả táo? ${"🍎".repeat(n)}`, n, `Chạm từng quả; số cuối cùng đọc ra là ${n}.`) },
  flip: () => { const n = fR(5, 9), m = fR(1, 4); return fT(`Em cần đủ ${n} quả táo và đã có ${m} quả. Cần thêm mấy quả?`, n - m, `${n} - ${m} = ${n - m}.`) },
  new: () => { const a = fR(2, 6), b = fR(2, 6); return fT(`Có ${"🍎".repeat(a)} và ${"🍌".repeat(b)}. Tất cả có bao nhiêu quả?`, a + b, `Đếm tiếp qua cả hai nhóm: ${a + b}.`) },
  verdict: KV("Nam đếm 🍎🍎🍎🍎 và đọc 'một, hai, ba, bốn', rồi nói: 'có 3 quả vì lúc đầu em đọc ba'. Nam nói đúng hay sai?", "Nam đếm 🍎🍎🍎🍎 và đọc 'một, hai, ba, bốn', rồi nói: 'có 4 quả vì số cuối em đọc là bốn'. Nam nói đúng hay sai?", "Số cuối cùng đọc ra chính là tổng số", "Số đọc đầu tiên mới là tổng số", "Số đọc ở giữa mới là tổng số", "Sai: tổng là số cuối cùng, bốn."),
  read: () => { let a, b; do { a = fR(3, 6); b = fR(2, 5) } while (a == b); return fC(`${"🍎".repeat(a)} ${"🍌".repeat(b)}  Có bao nhiêu quả TÁO?`, [`${a}`, `${a + b}`, `${b}`], "Đề hỏi riêng táo, không phải tất cả.") }
};
PRB.k3 = {
  same: () => { const n = fR(4, 8), m = fR(1, n); return fT(`${n} bạn xếp hàng. Lan đứng thứ ${m} (bạn đầu hàng là thứ 1). Có bao nhiêu người đứng TRƯỚC Lan?`, m - 1, `Thứ ${m} thì có ${m - 1} người đứng trước.`) },
  flip: () => { const k = fR(0, 6); return fT(`Có ${k} người đứng trước Lan. Lan đứng thứ mấy (bạn đầu hàng là thứ 1)?`, k + 1, `${k} người đứng trước nên Lan thứ ${k + 1}.`) },
  new: () => { const n = fR(3, 8); return fT(`Máy đếm từ 0. ${n} bạn xếp hàng, máy gán số lần lượt cho từng bạn. Bạn cuối hàng được gán số mấy?`, n - 1, `Từ 0 đến ${n - 1}.`) },
  verdict: KV("Nam nói: 'bạn đứng thứ nhất có 1 người đứng trước'. Nam nói đúng hay sai?", "Nam nói: 'bạn đứng thứ nhất có 0 người đứng trước'. Nam nói đúng hay sai?", "Bạn đứng đầu hàng không có ai đứng trước", "Bạn đứng đầu hàng luôn có 1 người đứng trước", "Không ai được đứng đầu hàng", "Sai: không có ai đứng trước."),
  read: () => { const n = fR(4, 8); return fC(`Hàng có ${n} bạn. Bạn đứng thứ ${n} (cuối hàng) có mấy người đứng TRƯỚC?`, [`${n - 1}`, `${n}`, `${n + 1}`], `Trước bạn cuối là ${n - 1} người.`) }
};
PRB.k4 = {
  same: () => { const a = fR(1, 5), b = fR(1, 5); return fT(`Hộp "kẹo" chứa ${a} viên. Em bỏ thêm ${b} viên vào hộp "kẹo". Hộp "kẹo" chứa mấy viên?`, a + b, `${a} + ${b} = ${a + b}.`) },
  flip: () => { const a = fR(1, 4), b = fR(2, 5); return fT(`Sau khi bỏ thêm ${b} viên, hộp "kẹo" chứa ${a + b} viên. Trước khi bỏ thêm, hộp chứa mấy viên?`, a, `${a + b} - ${b} = ${a}.`) },
  new: () => { const a = fR(1, 4), b = fR(5, 9); return fT(`Hộp "a" chứa ${a}, hộp "b" chứa ${b}. Em chép giá trị của hộp "b" bỏ vào hộp "a" (hộp "b" vẫn giữ nguyên). Hộp "a" giờ chứa mấy?`, b, `Hộp a nhận giá trị ${b}.`) },
  verdict: KV("Hà nói: 'đổi thứ bên trong hộp thì tên hộp cũng đổi theo'. Hà nói đúng hay sai?", "Hà nói: 'đổi thứ bên trong hộp thì tên hộp vẫn giữ nguyên'. Hà nói đúng hay sai?", "Tên là nhãn dán bên ngoài, không đổi khi đổi đồ bên trong", "Tên và thứ bên trong là một", "Hộp không có tên", "Sai: tên hộp giữ nguyên."),
  read: () => { const v = fR(2, 9); return fC(`Hộp có nhãn "kẹo" đang chứa ${v} viên. TÊN của hộp là gì?`, ["kẹo", `${v}`, "viên"], "Tên là nhãn dán bên ngoài.") }
};
PRB.k6 = {
  same: () => { const m = Math.random() < 0.5; return fC(`Luật: nếu trời mưa thì mang ô, nếu không thì đội mũ. Hôm nay trời ${m ? "mưa" : "không mưa"}. Em làm gì?`, m ? ["Mang ô", "Đội mũ", "Làm cả hai"] : ["Đội mũ", "Mang ô", "Làm cả hai"], "Chỉ một nhánh của luật được làm.") },
  flip: () => fC("Luật: nếu trời mưa thì mang ô, nếu không thì đội mũ. Em thấy bạn đội mũ. Hôm nay trời thế nào?", ["Không mưa", "Mưa", "Không đoán được"], "Chỉ khi không mưa mới đội mũ."),
  new: () => { const d = fR(1, 9); return fC(`Luật: nếu số lớn hơn 5 thì tô đỏ, nếu không thì tô xanh. Số ${d} được tô màu gì?`, d > 5 ? ["Đỏ", "Xanh", "Cả hai"] : ["Xanh", "Đỏ", "Cả hai"], `${d} ${d > 5 ? "lớn hơn" : "không lớn hơn"} 5.`) },
  verdict: KV("Hà nói: 'luật nếu-thì-nếu-không chạy cả hai nhánh mỗi lần'. Hà nói đúng hay sai?", "Hà nói: 'luật nếu-thì-nếu-không mỗi lần chỉ chạy đúng một nhánh'. Hà nói đúng hay sai?", "Điều kiện chỉ có thể đúng hoặc sai, nên chỉ một nhánh chạy", "Cả hai nhánh luôn chạy", "Không nhánh nào chạy", "Sai: chỉ một nhánh chạy."),
  read: () => fC("Luật: nếu số NHỎ hơn 5 thì tô đỏ. Số 5 có được tô đỏ không?", ["Không, vì 5 không nhỏ hơn 5", "Có", "Không đủ thông tin"], "5 bằng 5, chứ không nhỏ hơn 5.")
};
PRB.k7 = {
  same: () => { const n = fR(2, 6), m = fR(2, 4); return fT(`Lặp ${n} lần việc "thêm ${m} viên bi vào hộp". Hộp ban đầu rỗng. Cuối cùng có mấy viên?`, n * m, `${n} lần × ${m} = ${n * m}.`) },
  flip: () => { const n = fR(2, 5), m = fR(2, 4); return fT(`Lặp ${n} lần việc "thêm một số viên bằng nhau". Hộp ban đầu rỗng, cuối cùng có ${n * m} viên. Mỗi lần thêm mấy viên?`, m, `${n * m} chia ${n} = ${m}.`) },
  new: () => { const a = fR(0, 3); return fT(`Việc "thêm 1 viên" được lặp cho đến khi hộp có đúng 6 viên. Hộp đang có ${a} viên. Phải lặp mấy lần?`, 6 - a, `6 - ${a} = ${6 - a}.`) },
  verdict: KV("Nam nói: 'việc lặp mà không có điều kiện dừng thì vẫn tự dừng'. Nam nói đúng hay sai?", "Nam nói: 'việc lặp mà không có điều kiện dừng thì chạy mãi'. Nam nói đúng hay sai?", "Không có điều kiện dừng thì không gì làm nó dừng", "Máy tự biết lúc nào nên dừng", "Máy luôn dừng sau 10 lần", "Sai: nó lặp mãi."),
  read: () => { let n, m, s; do { n = fR(2, 4); m = fR(2, 3); s = fR(3, 6) } while (n * m == s); return fC(`Hộp đang có ${s} viên. Lặp ${n} lần việc "thêm ${m} viên". Cuối cùng hộp có bao nhiêu viên?`, [`${s + n * m}`, `${n * m}`, `${s}`], `Đừng quên ${s} viên có sẵn: ${s} + ${n * m}.`) }
};
Object.assign(PREQ, { k3: ["k1"], k7: ["k6"], bx0: ["k4"], p2: ["p1", "k6"], p3: ["p2", "k7"], l1: ["k3"] });
