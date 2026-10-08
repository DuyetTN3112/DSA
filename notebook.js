/* notebook.js: "sách giáo khoa" để giở lại khi chưa hiểu + bài dạy ĐỌC ĐỀ.
   - notebook(id, back, backLabel): sổ tay của bài. Phần viết tay là LES[id].note (nếu có); phần còn lại tự gom từ các câu
     "rút ra" (s) của từng bước bài học. Phần viết tay nằm ở k3, rd1 (trong file này), notes.js (14 bài nền), notes-more.js (18 bài đợt 2) và notes-foundation.js (15 bài đợt 3: mẫu giáo còn thiếu, b1, hash map, đệ quy, linked list), notes-debug.js (7 bài đợt 4: e1 đến e4, g2, g3, dp1); bài còn lại là bản tự gom từ câu "rút ra".
   - rd1: bài riêng dạy đọc đề (đề CHO gì, HỎI gì, điều kiện, nói lại bằng lời, thử ví dụ nhỏ, đề mơ hồ thì hỏi lại).
   Nạp sau probe-code.js, trước review.js. */
function notebook(id, back, backLabel) {
  const L = LES[id], p = $("#panel"), r = P.pr[id] || {}; p.className = "panel";
  const pts = [], skip = new Set(["order", "tests", "code", "reflect", "open", "build"]);
  (L.steps || []).forEach(st => { if (st.s && !skip.has(st.k) && !/^(Đã |Ôn lại|Test )/.test(st.s) && st.s.length >= 30 && !pts.includes(st.s)) pts.push(st.s) });
  const many = (r.unk || 0) >= 2;
  p.innerHTML = `<h2>📖 Sổ tay: ${L.t}</h2><p class="sub">Giở lại lý thuyết khi chưa hiểu là cách học đúng, giống mở sách giáo khoa khi làm bài tập. Điền bừa thì không.</p>` +
    (L.nbk ? nbkHtml(L.nbk) : L.note ? `<div class="fb ok">${L.note}</div>` : `<p class="sub">Bài này chưa có trang sổ tay viết tay; dưới đây là các ý chính bạn đã rút ra khi học.</p>`) +
    (pts.length ? (L.note ? `<details><summary>Các ý bạn đã tự rút ra khi học bài này</summary><ul>${pts.map(x => `<li>${x}</li>`).join("")}</ul></details>` : `<p><b>Các ý chính của bài:</b></p><ul>${pts.map(x => `<li>${x}</li>`).join("")}</ul>`) : "") +
    `<details><summary>Xem lại từng câu hỏi trong bài, kèm điều rút ra</summary>${(L.steps || []).filter(st => st.q && st.s && !skip.has(st.k)).map(st => `<div class="q" style="font-size:.92em">${st.q}<br><b>→ ${st.s}</b></div>`).join("")}</details>` +
    (L.ref ? `<details><summary>Lời giải chuẩn của bài code</summary><pre>${esc(L.ref)}</pre></details>` : "") +
    (many ? `<div class="fb">Bạn đã giở sổ tay ${r.unk} lần ở bài này. Đọc lại một đoạn ngắn có thể chưa đủ: nên học lại bài từ đầu, chậm hơn.</div>` : "") +
    `<p>${back ? `<button class="${many ? "ghost" : "go"}" id="nbb">${backLabel || "Quay lại"}</button> ` : ""}<button class="${many ? "go" : "ghost"}" id="nbr">Học lại bài từ đầu</button></p>`;
  if (back) $("#nbb").onclick = back;
  $("#nbr").onclick = () => start(id);
  p.querySelectorAll("[data-nb2]").forEach(b => b.onclick = () => notebook(b.dataset.nb2, () => notebook(id, back, backLabel), "Về bài " + L.t));
}

/* ===== "Sách giáo khoa mini": schema có cấu trúc cho một concept (mở rộng dần).
   Tương thích ngược: bài nào chưa có nbk thì notebook() vẫn render L.note (HTML cũ).
   pre: các bài nền để regress khi hổng; links: concept liên quan. */
const nbkHtml = n => `
  <div class="fb ok"><b>Ý tưởng:</b> ${n.idea}<br><b>Vì sao cần nó:</b> ${n.why}</div>
  <p><b>Mental model:</b> ${n.model}</p>
  <p><b>Quy tắc dùng ngay:</b> ${n.rule}</p>
  <p><b>Ví dụ nhỏ:</b> ${n.ex}</p>
  <p><b>Chạy tay từng bước:</b> ${n.trace}</p>
  <p><b>Ví dụ ngược (cái KHÔNG phải):</b> ${n.anti}</p>
  <p><b>Lỗi thường gặp:</b> ${n.pitfalls}</p>
  <p><b>Cách tự kiểm tra:</b> ${n.selfcheck}</p>
  <p><b>Liên hệ với bài đang làm:</b> ${n.link}</p>` +
  ((n.pre && n.pre.length) ? `<p><b>Hổng chỗ này? Về lại nền:</b> ${n.pre.filter(x => LES[x]).map(x => `<button class="ghost" data-nb2="${x}">📖 ${LES[x].t}</button>`).join(" ")}</p>` : "") +
  ((n.links && n.links.length) ? `<p><b>Xem thêm:</b> ${n.links.filter(x => LES[x]).map(x => `<button class="ghost" data-nb2="${x}">📖 ${LES[x].t}</button>`).join(" ")}</p>` : "");

/* ===== Ngân hàng tiny-check: câu hỏi siêu ngắn sau khi giở reference.
   Mục đích: có bằng chứng người học đã hiểu phần vừa đọc, trước khi quay lại câu hỏi chính.
   Quy ước: đáp án đúng luôn ở vị trí đầu (o[0]); tinyCheck tự xáo trộn khi hiện. */
const tkPick = (arr, n) => { const c = arr.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = c[i]; c[i] = c[j]; c[j] = t } return c.slice(0, n) };
const TINY = {
  k3: [
    () => { const ns = tkPick(["An", "Bình", "Chi", "Dũng", "Minh", "Lan", "Nam", "Hoa"], 4), t = ns[2]; return { q: `Hàng có 4 bạn: ${ns.join(", ")}. Bạn ${t} đứng thứ mấy?`, a: 3, w: "Đếm từ 1: thứ nhất, thứ hai, thứ ba." } },
    () => { const ns = tkPick(["An", "Bình", "Chi", "Dũng", "Minh", "Lan", "Nam", "Hoa"], 4), t = ns[2]; return { q: `Hàng: ${ns.join(", ")}. Bạn ${t} có bao nhiêu người đứng TRƯỚC?`, a: 2, w: `${ns[0]} và ${ns[1]} đứng trước ${t}.` } },
    () => { const ns = tkPick(["An", "Bình", "Chi", "Dũng", "Minh", "Lan", "Nam", "Hoa"], 4), t = ns[2]; return { q: `Hàng: ${ns.join(", ")}. Chỉ số (index) của bạn ${t} là mấy?`, a: 2, w: "Chỉ số = số người đứng trước." } },
    () => { const k = 1 + Math.floor(Math.random() * 3); return { q: `Một bạn có chỉ số là ${k} thì đứng thứ mấy?`, a: k + 1, w: "Thứ tự = chỉ số + 1." } },
    () => ({ q: `<pre>numbers = [10, 20, 30, 40]</pre>Phần tử đứng thứ 3 có chỉ số là mấy?`, a: 2, w: "Đứng thứ 3 → có 2 phần tử đứng trước → chỉ số 2." }),
    () => ({ q: `<pre>numbers = [10, 20, 30, 40]</pre><code>numbers[2]</code> là phần tử đứng thứ mấy?`, a: 3, w: "Chỉ số 2 nghĩa là có 2 phần tử đứng trước, nên đó là phần tử thứ 3." }),
  ],
  rd1: [
    () => ({ q: `Đề: «Cho một danh sách số. Hãy tìm số lớn nhất.» Đề CHO ta cái gì?`, o: ["Một danh sách số", "Số lớn nhất", "Cách tìm ra số lớn nhất"], a: 0, w: "CHO là dữ kiện đề đã cho sẵn, chưa phải điều phải tìm." }),
    () => ({ q: `Vẫn đề đó. Đề HỎI điều gì?`, o: ["Giá trị lớn nhất (một con số)", "Vị trí của số lớn nhất", "Danh sách các số"], a: 0, w: "Đề hỏi 'tìm số lớn nhất' — trả về giá trị, không phải vị trí." }),
    () => ({ q: `Đề: «Cho một danh sách số. Hãy tìm số lớn nhất.» Đầu vào và đầu ra là gì?`, o: ["Vào: danh sách số; Ra: một con số", "Vào: một con số; Ra: danh sách số", "Vào: danh sách số; Ra: danh sách số"], a: 0, w: "Đầu vào là thứ đề đưa cho ta; đầu ra là thứ đề muốn ta trả về." }),
    () => ({ q: `Đề: «Cho dãy [4, 9, 9, 2]. Tìm số lớn nhất, trả về VỊ TRÍ đầu tiên, đếm từ 0.» Cụm nào là ràng buộc phải gạch chân?`, o: ["VỊ TRÍ + đếm từ 0 + ĐẦU TIÊN", "Dãy có 4 số", "Số lớn nhất là 9"], a: 0, w: "Mỗi cụm nhỏ là một yêu cầu: hỏi vị trí (không phải giá trị), đếm từ 0, lấy cái đầu tiên." }),
  ],
};
/* bài nào dùng ngân hàng tiny-check nào khi không có bank riêng */
const TINY_FOR = { l1: "k3", a2: "k3", a3: "k3", b5: "k3", bs: "k3" };
function tinyFor(id, fk) {
  if (fk === "de") return "rd1"; // không hiểu đề -> kiểm tra lại kỹ năng đọc đề
  if (TINY[id]) return id;
  return TINY_FOR[id] || null;
}
/* tinyCheck(tk, backId, done): hỏi tối đa 3 câu siêu ngắn của concept tk.
   Đúng hết -> done() (quay lại câu hỏi chính). Sai -> gợi ý regress (học lại / kiểm tra nền). */
function tinyCheck(tk, backId, done) {
  const p = $("#panel"); p.className = "panel";
  if (!tk || !TINY[tk]) return done();
  const qs = tkPick(Object.keys(TINY[tk]).map(Number), Math.min(3, TINY[tk].length)).map(k => TINY[tk][k]());
  let i = 0, wrong = 0;
  const showQ = () => {
    if (i >= qs.length) {
      if (!wrong) return done();
      p.innerHTML = `<h2>Kiểm tra nhanh: chưa chắc</h2><div class="fb">Bạn sai ${wrong}/${qs.length} câu kiểm tra nhanh. Đọc thêm một lượt nữa chưa đủ — nên quay về chỗ bị hổng.</div><p><button class="go" id="tcr">Học lại bài từ đầu</button> <button class="ghost" id="tcn">Kiểm tra xem nền có hổng không</button> <button class="ghost" id="tct">Thử lại kiểm tra nhanh</button></p>`;
      $("#tcr").onclick = () => start(backId);
      $("#tcn").onclick = () => rootcheck(backId);
      $("#tct").onclick = () => tinyCheck(tk, backId, done);
      return;
    }
    const q = qs[i];
    if (typeof window !== "undefined") window.__tinyQ = q; // hook cho tools kiểm thử
    p.innerHTML = `<h2>Kiểm tra nhanh (${i + 1}/${qs.length})</h2><p class="sub">Trả lời đúng các câu rất ngắn này thì mình tin là bạn đã hiểu phần vừa đọc.</p><div class="q">${q.q}</div><div id="tin"></div><div id="tfb"></div>`;
    const good = msg => { $("#tfb").innerHTML = `<div class="fb ok">Đúng. ${msg || ""}</div><p><button class="go" id="tcn2">Tiếp</button></p>`; $("#tcn2").onclick = () => { i++; showQ() } };
    const bad = msg => { wrong++; $("#tfb").innerHTML = `<div class="fb">Chưa đúng. ${msg}</div><p><button class="go" id="tcn2">Tiếp</button></p>`; $("#tcn2").onclick = () => { i++; showQ() } };
    if (q.o) {
      const o = q.o.map((t, j) => ({ t, c: j }));
      for (let k = o.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const t = o[k]; o[k] = o[j]; o[j] = t }
      $("#tin").innerHTML = `<div class="opts">${o.map((x, j) => `<button data-o="${j}">${x.t}</button>`).join("")}</div>`;
      $("#tin").querySelectorAll("button").forEach(b => b.onclick = () => { o[+b.dataset.o].c == q.a ? good(q.w) : bad(q.w) });
    } else {
      $("#tin").innerHTML = `<input id="v" type="number" aria-label="Câu trả lời"> <button class="go" id="tok">Kiểm tra</button>`;
      const go = () => { const v = $("#v").value; if (v === "") return; +v === q.a ? good(q.w) : bad(q.w) };
      $("#tok").onclick = go; $("#v").onkeydown = e => { if (e.key === "Enter") go() };
    }
  };
  showQ();
}

/* ===== ghi chú viết tay cho bài "thứ tự, vì sao máy đếm từ 0" ===== */
LES.k3.nbk = {
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
  pre: ["k1"], links: ["rd1", "l1", "a2"],
};
LES.k3.note = `<b>Hai cách đếm, hai câu hỏi khác nhau.</b><br>• Đếm thường ngày hỏi: <i>"bạn này đứng thứ mấy?"</i> → thứ nhất, thứ hai, thứ ba...<br>• Máy hỏi: <i>"phía trước bạn này có mấy người?"</i> → bạn đầu hàng có <b>0</b> người đứng trước, bạn kế có <b>1</b>, bạn kế nữa có <b>2</b>...<br>Số "người đứng trước" gọi là <b>chỉ số (index)</b>. Vì bạn đầu hàng không có ai đứng trước nên chỉ số là 0. Máy đếm từ 0 không phải vì kỳ lạ, mà vì nó đếm "đã đi qua bao nhiêu".<br><b>Hai quy tắc dùng ngay:</b> (1) vị trí thứ k (đếm thường ngày) có chỉ số <b>k - 1</b>; (2) hàng có n bạn thì bạn cuối có chỉ số <b>n - 1</b> (không phải n).<br><b>Mẹo kiểm tra:</b> hàng 5 bạn thì các chỉ số là 0, 1, 2, 3, 4. Nếu bạn viết ra chỉ số 5 thì đã vượt quá hàng.`;

/* ===== rd1: đọc đề ===== */
LES.rd1 = {
  t: "Đọc đề: đề cho gì, hỏi gì", note: `<b>Bốn bước đọc đề, làm trước khi tính hay viết code:</b><br>1. <b>Đọc hai lần.</b> Lần một để hiểu chuyện gì đang xảy ra, lần hai để gạch chân.<br>2. <b>Gạch ba thứ:</b> đề <b>CHO</b> gì (dữ kiện), đề <b>HỎI</b> gì (điều phải tìm, thường ở câu có "hỏi", "mấy", "bao nhiêu", dấu ?), và có <b>ĐIỀU KIỆN</b> nào (chỉ, trừ, lớn hơn, ít nhất, đầu tiên, đếm từ 0...).<br>3. <b>Nói lại bằng lời của mình:</b> "đầu vào là ..., đầu ra là ...". Nói không trôi chảy nghĩa là chưa hiểu đề.<br>4. <b>Thử một ví dụ nhỏ</b> trước khi làm thật. Nếu đề mơ hồ thì <b>hỏi lại</b> hoặc <b>ghi ra giả định</b> mình chọn, không được đoán thầm.<br><b>Lỗi hay gặp:</b> đề quen nhưng câu HỎI khác một chữ, đáp án khác hẳn; bỏ sót điều kiện nhỏ như "lớn hơn" (khác "ít nhất"); trả lời vị trí thay vì giá trị.<br><b>Mở rộng:</b> 5. Xác định <b>đầu vào / đầu ra</b> (đề đưa gì, muốn trả gì). 6. Gạch <b>động từ</b> (việc phải làm: tìm, đếm, sắp xếp) và <b>đối tượng</b> (xử lý cái gì). 7. Liệt kê <b>trường hợp đặc biệt</b>: rỗng? số âm? trùng nhau? — nghĩ trước, khỏi sửa sau.`,
  steps: [
    C("Đề: «Lan có 5 cái kẹo, cho Nam 2 cái. Hỏi Lan còn mấy cái kẹo?». Đề CHO ta những thông tin nào?", ["Lan có 5 cái kẹo, và cho Nam 2 cái", "Lan còn mấy cái kẹo", "Nam rất thích kẹo"], 0, "CHO là những điều đề đã nói chắc chắn, chưa phải điều phải tìm.", "CHO = điều đề đã nói sẵn: có 5 cái, cho đi 2 cái."),
    C("Vẫn đề đó: «Lan có 5 cái kẹo, cho Nam 2 cái. Hỏi Lan còn mấy cái kẹo?». Đề HỎI điều gì?", ["Lan còn mấy cái kẹo", "Lan cho Nam mấy cái", "Lan có mấy cái lúc đầu"], 0, "Tìm câu có chữ 'hỏi' hoặc 'mấy'. Điều phải tìm nằm ở đó.", "HỎI = điều ta phải tìm ra. Thường nằm ở câu có 'hỏi', 'mấy', 'bao nhiêu' hoặc dấu ?."),
    I("Hiểu đề xong mới tính. Lan còn mấy cái kẹo?", 3, "Có 5, cho đi 2: còn lại bao nhiêu?", "5 - 2 = 3. Thứ tự đúng: hiểu đề trước, tính sau."),
    C("Đề mới: «Lan có 5 cái kẹo, cho Nam 2 cái. Hỏi NAM được mấy cái kẹo?». Câu trả lời là gì?", ["2", "3", "5"], 0, "Đọc kỹ chữ cuối: đề hỏi AI, và hỏi điều GÌ?", "Dữ kiện y hệt đề trước nhưng câu HỎI khác nên đáp án khác. Đề quen mà đọc lướt thì sai ngay."),
    C("Đề: «Chỉ đếm những quả táo ĐỎ trong hàng: 🍎 🍏 🍎 🍎 🍏». 🍎 là táo đỏ, 🍏 là táo xanh. Có mấy quả cần đếm?", ["3", "5", "2"], 0, "Gạch chân chữ 'chỉ' và chữ 'đỏ': chúng thu hẹp việc cần làm.", "ĐIỀU KIỆN (chỉ, trừ, lớn hơn, ít nhất, đầu tiên...) thu hẹp việc cần làm. Phải gạch chân chúng."),
    C("Đề: «Trong dãy 4, 9, 9, 2, tìm số lớn nhất và trả về VỊ TRÍ đầu tiên của nó, đếm từ 0.». Đáp án là gì?", ["1", "2", "9"], 0, "Có ba điều: hỏi vị trí chứ không hỏi giá trị; đếm từ 0; lấy cái đầu tiên (có hai số 9).", "Mỗi cụm chữ nhỏ là một yêu cầu: hỏi VỊ TRÍ (không phải giá trị), đếm từ 0, lấy cái ĐẦU TIÊN. Bỏ sót một cụm là sai."),
    C("Nói lại bằng lời mình. Đề: «Cho một danh sách số. Đếm xem có bao nhiêu số chẵn.». Cách nói lại nào ĐÚNG và đủ?", ["Đầu vào là một dãy số; đầu ra là MỘT con số: số lượng các số chẵn", "Đầu vào là một số; đầu ra là danh sách các số chẵn", "Đầu vào là một dãy số; đầu ra là tổng của các số chẵn"], 0, "Đầu vào là gì, đầu ra là gì, và đầu ra là MỘT con số hay một danh sách?", "Nói lại theo mẫu 'đầu vào là ..., đầu ra là ...'. Hiểu sai ở bước này còn sửa dễ; code xong mới phát hiện thì tốn công hơn nhiều."),
    C("Đề: «Tìm số lớn thứ hai.» với danh sách [5, 5, 3]. Đề chưa nói rõ 'lớn thứ hai' tính hai số 5 là hai số khác nhau hay một. Bạn nên làm gì trước khi tính?", ["Hỏi lại, hoặc ghi rõ giả định mình chọn", "Chọn đại một cách rồi làm", "Bỏ qua vì chắc không quan trọng"], 0, "Hai cách hiểu cho hai đáp án khác nhau (5 hoặc 3). Đoán thầm có an toàn không?", "Đề mơ hồ thì HỎI LẠI hoặc GHI RA giả định. Đoán thầm là nguồn lỗi lớn nhất vì không ai biết mình đã chọn gì."),
    I("Thử ví dụ nhỏ để chắc mình hiểu đề: «Mỗi bạn nhận 2 cái kẹo. Có 4 bạn. Cần mua tổng cộng bao nhiêu cái kẹo?»", 8, "Vẽ nhanh: bạn 1 có 2, bạn 2 có 2... cộng lại.", "4 bạn x 2 cái = 8. Tính được ví dụ nhỏ bằng tay nghĩa là bạn hiểu đề."),
    C("Đề: «Cho một danh sách số. Hãy tìm số lớn nhất.» Đầu VÀO của đề là gì?", ["Một danh sách các số", "Một số duy nhất", "Số lớn nhất"], 0, "Đầu vào là thứ đề ĐƯA cho ta trước khi làm.", "Đầu vào = dữ kiện ban đầu: một danh sách số."),
    C("Vẫn đề đó. Đầu RA của đề là gì?", ["Một số duy nhất: số lớn nhất", "Một danh sách các số", "Vị trí của số lớn nhất"], 0, "Đầu ra là thứ đề MUỐN ta trả về.", "Đầu ra = kết quả: một con số (giá trị lớn nhất), không phải danh sách."),
    C("Đề: «Cho một danh sách số. Hãy tìm số lớn nhất.» Từ nào cho biết VIỆC ta phải làm?", ["tìm", "cho", "một"], 0, "Động từ là từ chỉ hành động: ta phải làm gì với dữ kiện?", "Động từ quan trọng là 'tìm': việc cần làm là tìm kiếm, không phải đếm hay sắp xếp."),
    C("Đề: «Cho một danh sách số. Hãy tìm số lớn nhất.» Đề đang nói về ĐỐI TƯỢNG nào?", ["Các số trong danh sách", "Người ra đề", "Máy tính"], 0, "Tự hỏi: đề bảo ta xử lý cái gì?", "Đối tượng là các số trong danh sách — mọi suy nghĩ đều xoay quanh chúng."),
    C("Đề: «Cho một danh sách số. Hãy tìm số lớn nhất.» Trường hợp đặc biệt nào CẦN nghĩ tới trước khi làm?", ["Danh sách rỗng, hoặc toàn số âm", "Danh sách có đúng 10 số", "Số lớn nhất luôn là số dương"], 0, "Edge case: dữ kiện nào làm cách làm thông thường bị sai?", "Danh sách rỗng thì 'số lớn nhất' không tồn tại; toàn số âm thì không được bắt đầu từ 0. Nghĩ trước, khỏi sửa sau."),
    RF("Chọn một đề ở trên. Nói lại bằng lời của bạn: đề CHO gì, đề HỎI gì, và có điều kiện nào cần gạch chân?")
  ]
};
LES.rd1.dr = undefined;
(() => {
  const k = ids.indexOf("k3"); if (!ids.includes("rd1")) ids.splice(k + 1, 0, "rd1");
  const s = STAGES[0]; if (!s.L.includes("rd1")) s.L.splice(s.L.indexOf("k3") + 1, 0, "rd1");
  PREQ.rd1 = ["k3"];
  const pr = fPre, name = ["Lan", "Nam", "Hà", "Khoa", "Mai"], thing = ["cái kẹo", "quyển vở", "quả bóng"];
  const pick2 = () => { const a = aPick(name); let b; do { b = aPick(name) } while (b == a); return [a, b] };
  PRB.rd1 = {
    same: () => { const [a, b] = pick2(), th = aPick(thing); let n, m; do { n = fR(6, 12); m = fR(2, n - 2) } while (n == 2 * m); const w = fR(0, 2), ask = [`${a} còn mấy ${th}`, `${b} được mấy ${th}`, `${a} có mấy ${th} LÚC ĐẦU`][w], r = [n - m, m, n][w]; return fT(`«${a} có ${n} ${th}, cho ${b} ${m} ${th}. Hỏi ${ask}?» Đáp án là mấy?`, r, `Đề CHO: có ${n}, cho đi ${m}. Đề HỎI: ${ask}. Câu hỏi quyết định đáp án: ${r}.`) },
    flip: () => { const [a, b] = pick2(), n = fR(8, 15), m = fR(3, n - 3); return fT(`«${a} có ${n} cái kẹo, cho ${b} một số cái. Hỏi ${a} còn mấy cái?» Biết đáp án đúng của đề là ${n - m}. ${a} đã cho ${b} mấy cái?`, m, `Còn lại ${n - m} nghĩa là đã cho đi ${n} - ${n - m} = ${m} cái.`) },
    new: () => { const L = Array.from({ length: fR(5, 6) }, () => 10 * fR(3, 12)), t = aPick(L), md = fR(0, 2), phr = ["LỚN HƠN", "ÍT NHẤT", "NHỎ HƠN"][md], c = L.filter(x => md == 0 ? x > t : md == 1 ? x >= t : x < t).length; return fT(`Yêu cầu: «Cho danh sách số tiền các đơn hàng: ${J0(L)}. Đếm số đơn có số tiền ${phr} ${t}.» Đáp án là mấy?`, c, `Điều kiện là '${phr} ${t}': ${md == 1 ? "có dấu bằng, đơn đúng " + t + " cũng tính" : "không có dấu bằng, đơn đúng " + t + " không tính"}. Có ${c} đơn.`) },
    verdict: KV("Hà nói: 'đề quen thì chỉ cần đọc lướt một lần rồi làm luôn cho nhanh'. Hà nói đúng hay sai?", "Hà nói: 'trước khi làm phải nói lại đề bằng lời của mình và thử một ví dụ nhỏ'. Hà nói đúng hay sai?", "Đề quen nhưng câu HỎI khác một chữ thì đáp án khác hẳn", "Đọc lướt luôn nhanh và an toàn", "Ví dụ nhỏ làm mất thời gian vô ích", "Sai: lướt đề quen là cách dễ sai nhất; chỉ cần câu hỏi cuối đổi một chữ là đáp án đổi."),
    read: () => { const k = fR(3, 6); let m; do { m = fR(2, 4) } while (m == k); return fC(`«Có ${k * m} cái kẹo, mỗi bạn nhận ${m} cái. Hỏi MỖI BẠN nhận mấy cái kẹo?» Đáp án là gì?`, [String(m), String(k), String(k * m)], `Đề đã CHO sẵn mỗi bạn nhận ${m} cái, và HỎI đúng điều đó. Nếu chia ${k * m} / ${m} = ${k} thì đó là số bạn, không phải điều đề hỏi.`) }
  };
  bank("rd1", "read", [() => { let L, i; do { L = pDistinct(3, 9); i = L.indexOf(Math.max(...L)) } while (new Set([i, Math.max(...L), i + 1]).size < 3); return fC(`«Cho dãy ${J0(L)}. Tìm số lớn nhất và trả về VỊ TRÍ của nó, đếm từ 0.» Đáp án là gì?`, [String(i), String(Math.max(...L)), String(i + 1)], `Đề HỎI vị trí, đếm từ 0: số lớn nhất là ${Math.max(...L)} nằm ở chỉ số ${i}. Trả ${Math.max(...L)} là trả giá trị, sai yêu cầu.`) }]);
  function J0(a) { return "[" + a.join(", ") + "]" }
})();
