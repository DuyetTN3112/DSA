/* review.js: Ôn cách quãng (Leitner), kiểm tra sức khỏe nền tảng, đổi cách dạy khi trượt lần 2, hồ sơ học.
   Nạp SAU probe-last.js. Dùng lại probe() (cược độ chắc chắn, bẫy đọc đề, đoán may đều tính).
   Quy tắc thoái lui có bằng chứng (không reset vô lý):
   - Sai 1 lần khi ôn: về hộp 1, mai ôn lại. Chỉ đánh dấu ⚠ khi có bằng chứng mạnh: tự tin mà sai, đọc sai đề,
     bài đã ở hộp >= 3 mà sai không phải do cẩu thả, hoặc sai liên tiếp.
   - Sai 2 lần liên tiếp: ⚠ và gợi ý lần ngược tìm bài nền.
   - Sai 3 lần liên tiếp: rút dấu xong, học lại từ đầu (các bài dựa trên nó bị ⚠).
   Dữ liệu: P.lt[id] = {box 1..5, due, n, lapse, cl (sai liên tiếp), ls (dạng câu lần trước), seen}; P.hc = {seen, fail, last}; P.diag[id]. */
(() => {
  const LT = () => P.lt || (P.lt = {}), HC = () => P.hc || (P.hc = { seen: {}, fail: {} });
  const TD = () => (typeof window !== "undefined" && window.__fakeToday) || today();
  const addD = (d, n) => { const t = new Date(d + "T00:00:00Z"); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10) };
  const DAYS = [1, 3, 7, 14, 30];
  /* nền tảng: đếm, tên và hộp, nếu-thì, lặp, thứ tự câu lệnh, biến, điều kiện, vòng lặp, hàm/return, chỉ số, cộng dồn */
  const FOUND = ["k1", "k4", "k6", "k7", "bx0", "p1", "p2", "p3", "p4", "a2", "a3", "sm"];
  const SH = { same: "đổi số", flip: "đi ngược chiều", new: "bối cảnh mới", verdict: "tự phán đúng/sai", read: "đọc kỹ đề" };
  const HAB = { careless: "Cẩu thả (sai trong chưa đầy 4 giây)", misread: "Đọc sai đề", overconfident: "Chắc chắn mà vẫn sai" };
  const FIX = {
    same: "Bạn sai cả ở dạng cơ bản nhất (đổi số). Lần này học chậm lại: ở mỗi bước, tự dự đoán đáp án TRƯỚC khi bấm.",
    flip: "Bạn làm được chiều xuôi nhưng sai khi đi ngược. Tức là mới nhớ cách làm, chưa hiểu quan hệ hai chiều. Lần này sau mỗi ví dụ, tự hỏi: nếu đề cho KẾT QUẢ thì suy ra ĐẦU VÀO thế nào?",
    new: "Bạn sai khi đổi bối cảnh. Tức là mới nhớ ví dụ, chưa nhìn ra ý tưởng chung. Lần này sau mỗi ví dụ, tự nghĩ thêm một ví dụ khác ngoài đời.",
    verdict: "Bạn khó tự phán đúng/sai và nói vì sao. Lần này hãy nói thành lời lý do của mỗi đáp án, không chỉ chọn.",
    read: "Bạn hay sai ở câu bẫy đọc đề. Lần này trước mỗi câu, gạch dưới điều đề HỎI và điều đề CHO, rồi mới tính."
  };
  const pane = () => { const p = $("#panel"); p.className = "panel"; return p };
  const esc = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const T = id => "«" + LES[id].t + "»";

  const item = id => { const L = LT(); if (!L[id]) L[id] = { box: 1, due: addD((P.pr[id] && P.pr[id].last) || TD(), 1), n: 0, lapse: 0, cl: 0, ls: "", seen: "" }; return L[id] };
  const eligible = () => Object.keys(PRB).filter(id => P.done[id] && LES[id]);
  const dueList = () => { const t = TD(); return eligible().filter(id => { const it = item(id); return it.seen !== t && (it.due <= t || P.shaky[id]) })
    .sort((a, b) => (P.shaky[b] ? 1 : 0) - (P.shaky[a] ? 1 : 0) || item(a).due.localeCompare(item(b).due) || item(a).box - item(b).box) };
  const nextDue = () => eligible().map(id => ({ id, d: item(id).due })).sort((a, b) => a.d.localeCompare(b.d))[0];
  const foundDone = () => FOUND.filter(i => P.done[i] && PRB[i] && LES[i]);
  const hcDue = () => { if (foundDone().length < 3) return false; const l = HC().last; return !l || addD(l, 7) <= TD() };

  function pickShape(id, allow) {
    const ms = (P.pr[id] && P.pr[id].miss) || {}, it = item(id);
    let sh = (allow || Object.keys(SH)).filter(s => PRB[id][s]);
    if (sh.length > 1 && it.ls) sh = sh.filter(s => s !== it.ls);
    const w = sh.map(s => (s === "same" ? .5 : 1) + 2 * (ms[s] || 0)), tot = w.reduce((a, b) => a + b, 0); let x = Math.random() * tot;
    for (let i = 0; i < sh.length; i++) { x -= w[i]; if (x < 0) return sh[i] }
    return sh[sh.length - 1];
  }

  /* rút dấu xong có bằng chứng: giống rootcheck */
  function withdraw(id) {
    delete P.done[id]; P.weak[id] = (P.weak[id] || 0) + 1; delete LT()[id]; delete P.shaky[id];
    deps(id).filter(z => P.done[z]).forEach(z => P.shaky[z] = 1); save(); road();
  }

  function grade(id, sh, ok, info) {
    const it = item(id), fl = (info && info.flags && info.flags[sh]) || "", t = TD(), was = it.box; let res;
    it.seen = t; it.n++;
    if (ok) { it.box = Math.min(5, it.box + 1); it.cl = 0; it.due = addD(t, DAYS[it.box - 1]); res = "up" }
    else if (fl === "lucky" || fl === "unknown") { it.due = addD(t, 1); res = fl === "unknown" ? "unknown" : "lucky" }
    else {
      it.lapse++; it.cl++; it.box = 1; it.due = addD(t, 1); res = "down";
      if (fl) { P.hab = P.hab || {}; P.hab[fl] = (P.hab[fl] || 0) + 1 }
      if (fl === "overconfident" || fl === "misread" || it.cl >= 2 || (was >= 3 && fl !== "careless")) P.shaky[id] = 1;
      if (it.cl >= 3) { withdraw(id); res = "withdrawn" }
    }
    save(); return { id, sh, res, box: it.box, due: it.due, was, fl, cl: it.cl };
  }

  function reviewSpaced() {
    cur = null; road(); const p = pane(), all = dueList(), L = all.slice(0, 6), out = []; let k = 0;
    if (!eligible().length) { p.innerHTML = `<h2>Ôn cách quãng</h2><p class="sub">Chưa có bài nào để ôn. Hãy qua kiểm tra hiểu thật của ít nhất một bài, rồi quay lại: ôn lại thứ chưa hiểu thì vô nghĩa.</p>`; return }
    if (!L.length) { const n = nextDue(); p.innerHTML = `<h2>Ôn cách quãng</h2><div class="fb ok">Hôm nay không còn bài nào đến hạn ôn.</div><p class="sub">Bài gần nhất cần ôn: ${T(n.id)} vào ngày ${n.d}. Ôn đúng lúc sắp quên thì nhớ lâu hơn ôn dồn.</p>`; return }
    const nxt = () => {
      if (k >= L.length) return summary();
      const id = L[k++], sh = pickShape(id); item(id).ls = sh;
      probe(id, 0, { shapes: [sh], title: "Ôn cách quãng", tag: `Bài ${k}/${L.length}. Một câu về ${T(id)}, dạng: ${SH[sh]}`, onEnd: (ok, info) => { out.push(grade(id, sh, ok, info)); nxt() } });
    };
    const line = r => ({
      up: `✓ ${T(r.id)}: lên hộp ${r.box}/5, ôn lại sau ${DAYS[r.box - 1]} ngày.`,
      lucky: `~ ${T(r.id)}: đúng nhưng bạn chọn «Đoán», nên chưa tính. Mai ôn lại.`,
      unknown: `? ${T(r.id)}: bạn nói thật là chưa nhớ: không tính là sai, hộp giữ nguyên, mai ôn lại. Hãy giở sổ tay bài này trước.`,
      down: `✗ ${T(r.id)}: về hộp 1, mai ôn lại. ${{ careless: "Bạn trả lời quá nhanh và sai: dấu hiệu cẩu thả.", overconfident: "Bạn chọn «Chắc chắn» mà sai: hiểu lầm nằm sâu.", misread: "Lỗi ĐỌC SAI ĐỀ." }[r.fl] || "Chưa nhớ hoặc chưa hiểu chắc."}${P.shaky[r.id] ? " Bài được đánh dấu ⚠: cần chứng minh lại bằng kiểm tra hiểu thật." : ""}`,
      withdrawn: `✗✗ ${T(r.id)}: sai 3 lần liên tiếp khi ôn. Mình rút dấu xong và mở lại từ đầu: lặp mà vẫn sai nghĩa là chưa hiểu chắc.`
    }[r.res]);
    const summary = () => {
      const sk = out.filter(r => r.res === "down" && P.shaky[r.id]), rc = out.filter(r => r.res === "down" && r.cl >= 2 && testable(r.id).length);
      p.innerHTML = `<h2>Ôn cách quãng: xong</h2><ul style="padding-left:4px">${out.map(r => `<li style="list-style:none">${line(r)}</li>`).join("")}</ul>${all.length > L.length ? `<p class="sub">Còn ${all.length - L.length} bài đến hạn, để buổi sau.</p>` : ""}` +
        out.filter(r => r.res === "unknown").map(r => `<p><button class="ghost" data-nb="${r.id}">📖 Giở sổ tay ${T(r.id)}</button></p>`).join("") + sk.map(r => `<p><button class="ghost" data-pf="${r.id}">Chứng minh lại ${T(r.id)} (kiểm tra hiểu thật)</button></p>`).join("") +
        rc.map(r => `<p><button class="ghost" data-rc="${r.id}">Sai liên tiếp ở ${T(r.id)}: kiểm tra xem nền có hổng không</button></p>`).join("") + `<p><button class="go" id="rvx">Tiếp tục</button></p>`;
      p.querySelectorAll("[data-nb]").forEach(b => b.onclick = () => notebook(b.dataset.nb, () => reviewSpaced(), "Về buổi ôn"));
      p.querySelectorAll("[data-pf]").forEach(b => b.onclick = () => probe(b.dataset.pf, 1));
      p.querySelectorAll("[data-rc]").forEach(b => b.onclick = () => rootcheck(b.dataset.rc));
      $("#rvx").onclick = () => draw();
    };
    p.innerHTML = `<h2>Ôn cách quãng</h2><p class="sub">${all.length} bài đến hạn, hôm nay ôn ${L.length} bài, mỗi bài một câu mới, dạng câu thay đổi mỗi lần. Đúng thì bài lên hộp cao hơn và ôn thưa dần (1, 3, 7, 14, 30 ngày). Sai thì về hộp 1. Không có gợi ý: ôn là để thử xem còn nhớ không.</p><p><button class="go" id="rvs">Bắt đầu</button></p>`;
    $("#rvs").onclick = nxt;
  }

  function healthCheck() {
    cur = null; road(); const p = pane(), f = foundDone(), h = HC();
    if (f.length < 3) { p.innerHTML = `<h2>Kiểm tra nền tảng</h2><p class="sub">Cần học xong ít nhất 3 bài nền tảng (đếm, biến, điều kiện, vòng lặp...) rồi mới kiểm tra được. Hãy học tiếp, mình sẽ gọi bạn quay lại.</p>`; return }
    const L = f.sort((a, b) => (P.shaky[b] ? 1 : 0) - (P.shaky[a] ? 1 : 0) || (h.seen[a] || "").localeCompare(h.seen[b] || "")).slice(0, 6), out = []; let k = 0;
    const nxt = () => {
      if (k >= L.length) return fin();
      const id = L[k++], sh = pickShape(id, ["flip", "read", "new"]);
      probe(id, 0, { shapes: [sh], title: "Kiểm tra nền tảng", tag: `Nền ${k}/${L.length}. Một câu về ${T(id)}, dạng: ${SH[sh]}`, onEnd: (ok, info) => {
        const fl = (info && info.flags && info.flags[sh]) || "", t = TD(); let res;
        if (ok) { h.seen[id] = t; h.fail[id] = 0; res = "ok" }
        else if (fl === "lucky" || fl === "unknown") res = fl === "unknown" ? "unknown" : "lucky";
        else { h.fail[id] = (h.fail[id] || 0) + 1; if (fl) { P.hab = P.hab || {}; P.hab[fl] = (P.hab[fl] || 0) + 1 }
          if (h.fail[id] >= 2) { withdraw(id); h.fail[id] = 0; res = "withdrawn" } else { P.shaky[id] = 1; res = "shaky" } }
        out.push({ id, res }); save(); nxt() } });
    };
    const fin = () => {
      h.last = TD(); save(); road();
      const msg = { ok: "vững.", lucky: "đúng nhưng bạn chọn «Đoán», chưa tính. Lần sau kiểm tra lại.", unknown: "bạn nói thật là chưa nhớ: không tính là sai, nhưng nền chưa chắc nên cần giở sổ tay và học lại phần này.", shaky: "chưa chắc. Mình đánh dấu ⚠. Kiểm tra nền tảng lần sau mà còn sai thì bài này bị mở lại từ đầu.", withdrawn: "sai ở hai lần kiểm tra liên tiếp. Mình rút dấu xong và mở lại từ đầu; các bài dựa trên nó bị ⚠. Sửa nền trước khi đi tiếp, nếu không lỗi sẽ lan lên các bài cao hơn." };
      const bad = out.filter(r => r.res == "shaky" || r.res == "withdrawn"), unk = out.filter(r => r.res == "unknown");
      p.innerHTML = `<h2>Kiểm tra nền tảng: kết quả</h2><ul style="padding-left:4px">${out.map(r => `<li style="list-style:none">${{ ok: "✓", lucky: "~", unknown: "?", shaky: "✗", withdrawn: "✗✗" }[r.res]} ${T(r.id)}: ${msg[r.res]}</li>`).join("")}</ul>${bad.length || unk.length ? "" : `<div class="fb ok">Nền tảng đang vững. Kiểm tra lại sau khoảng 7 ngày.</div>`}` + unk.map(r => `<p><button class="ghost" data-nb="${r.id}">📖 Giở sổ tay ${T(r.id)}</button></p>`).join("") +
        bad.map(r => r.res == "withdrawn" ? `<p><button class="go" data-st="${r.id}">Học lại ${T(r.id)}</button></p>` : `<p><button class="ghost" data-pf="${r.id}">Chứng minh lại ${T(r.id)}</button>${testable(r.id).length ? ` <button class="ghost" data-rc="${r.id}">Kiểm tra bài nền của nó</button>` : ""}</p>`).join("") + `<p><button class="go" id="hcx">Tiếp tục</button></p>`;
      p.querySelectorAll("[data-st]").forEach(b => b.onclick = () => start(b.dataset.st));
      p.querySelectorAll("[data-nb]").forEach(b => b.onclick = () => notebook(b.dataset.nb, () => healthCheck(), "Về kiểm tra nền tảng"));
      p.querySelectorAll("[data-pf]").forEach(b => b.onclick = () => probe(b.dataset.pf, 1));
      p.querySelectorAll("[data-rc]").forEach(b => b.onclick = () => rootcheck(b.dataset.rc));
      $("#hcx").onclick = () => draw();
    };
    p.innerHTML = `<h2>Kiểm tra nền tảng</h2><p class="sub">Nền tảng hỏng thì mọi bài cao hơn đều lung lay, nên mình kiểm tra định kỳ, không đợi hỏng nặng mới biết. Mỗi bài nền một câu mới, ${L.length} câu: ${L.map(T).join(", ")}. Sai một lần thì chỉ bị ⚠; sai hai lần kiểm tra liên tiếp thì bài đó phải học lại.</p><p><button class="go" id="hcs">Bắt đầu</button></p>`;
    $("#hcs").onclick = nxt;
  }

  /* trượt từ lần 2: đổi cách học, không học lại y như cũ */
  const dgSeen = new Set();
  function diagnose(id, go) {
    const p = pane(), r = P.pr[id] || {}, ms = Object.entries(r.miss || {}).sort((a, b) => b[1] - a[1]).filter(x => SH[x[0]]), n = P.weak[id] || 0, hb = P.hab || {};
    const top = ms[0] && ms[0][0];
    p.innerHTML = `<h2>Trượt ${n} lần: đổi cách học</h2><div class="fb"><b>Học lại y như cũ thì dễ trượt y như cũ.</b> Mình xem bạn trượt ở đâu để lần này học khác đi.</div>` +
      (ms.length ? `<p class="sub">Các dạng câu bạn hay sai ở ${T(id)}: ${ms.map(([s, c]) => `${SH[s]} (${c} lần)`).join("; ")}.</p>` : "") +
      `<p><b>Cách học lần này:</b> ${FIX[top] || "Học chậm lại, mỗi bước tự dự đoán trước khi bấm."}${hb.careless >= 2 ? " Bạn đã nhiều lần sai vì quá nhanh: đếm thầm đến 3 trước khi trả lời." : ""}${hb.misread >= 2 ? " Bạn đã nhiều lần đọc sai đề: đọc đề hai lần." : ""}</p>` +
      `<div class="q">Trước khi học lại, viết bằng lời của bạn: bài này nói về điều gì, và bạn nghĩ mình đã hiểu sai chỗ nào?</div><textarea id="dgt" aria-label="Tự giải thích"></textarea><p class="sub" id="dgh">Viết một hai câu thật sự (không gõ bừa) thì nút bên dưới mới mở.</p><p><button class="go" id="dgb" disabled>Bắt đầu học lại</button>${testable(id).length ? ` <button class="ghost" id="dgr">Kiểm tra xem nền có hổng không</button>` : ""}</p>`;
    $("#dgt").oninput = () => { $("#dgb").disabled = !okR($("#dgt").value) };
    $("#dgb").onclick = () => { P.diag = P.diag || {}; P.diag[id] = { n, text: $("#dgt").value.trim(), at: TD(), top: top || "" }; save(); go() };
    if ($("#dgr")) $("#dgr").onclick = () => rootcheck(id);
  }
  const st0 = start;
  start = function (id) {
    const k = id + ":" + ((P.weak && P.weak[id]) || 0);
    if (LES[id] && PRB[id] && (P.weak[id] || 0) >= 2 && !dgSeen.has(k)) { dgSeen.add(k); return diagnose(id, () => st0(id)) }
    return st0(id);
  };

  function profile() {
    cur = null; road(); const p = pane(), all = Object.keys(PRB).filter(i => LES[i]), done = all.filter(i => P.done[i]);
    const days = i => ((P.pr[i] || {}).days || []).length, shaky = done.filter(i => P.shaky[i]), stable = done.filter(i => !P.shaky[i] && days(i) >= 2), unst = done.filter(i => !P.shaky[i] && days(i) < 2);
    const weak = Object.entries(P.weak || {}).filter(([i, n]) => LES[i] && n > 0).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const miss = {}; Object.values(P.pr || {}).forEach(r => Object.entries(r.miss || {}).forEach(([s, c]) => miss[s] = (miss[s] || 0) + c));
    const ms = Object.entries(miss).filter(x => SH[x[0]]).sort((a, b) => b[1] - a[1]), hb = Object.entries(P.hab || {}).filter(x => HAB[x[0]]).sort((a, b) => b[1] - a[1]);
    const unk = Object.keys(P.pr || {}).filter(i => LES[i] && P.pr[i].unk).map(i => [i, P.pr[i].unk]).sort((a, b) => b[1] - a[1]).slice(0, 5), asst = Object.values(P.pr || {}).reduce((t, r) => t + (r.asst || 0), 0);
    const bx = [1, 2, 3, 4, 5].map(b => eligible().filter(i => item(i).box == b).length), due = dueList().length;
    const next = shaky.length ? `Chứng minh lại các bài ⚠ (${shaky.slice(0, 3).map(T).join(", ")}) bằng nút «Kiểm tra hiểu thật» trong bài.` : due ? `Có ${due} bài đến hạn: bấm «Ôn cách quãng».` : hcDue() ? "Đến hạn kiểm tra nền tảng: bấm «Kiểm tra nền tảng»." : unst.length ? `Có ${unst.length} bài mới qua một ngày: quay lại vào ngày khác để chứng minh vững.` : "Học tiếp bài kế trên lộ trình.";
    p.innerHTML = `<h2>Hồ sơ học</h2><p class="sub">Không đếm bài đã làm. Đếm điều bạn thật sự chứng minh được.</p>` +
      `<p><b>Bài có kiểm tra hiểu thật:</b> đã qua ${done.length}/${all.length}. Vững (qua ở ≥2 ngày khác nhau): <b>${stable.length}</b>. Chưa vững: <b>${unst.length}</b>. Cần chứng minh lại ⚠: <b>${shaky.length}</b>.</p>` +
      (shaky.length ? `<p class="sub">⚠: ${shaky.map(T).join("; ")}</p>` : "") +
      `<p><b>Nền tảng yếu (số lần phải học lại):</b> ${weak.length ? weak.map(([i, n]) => `${T(i)} (${n})`).join("; ") : "chưa có."}</p>` +
      `<p><b>Dạng câu hay sai nhất:</b> ${ms.length ? ms.slice(0, 3).map(([s, c]) => `${SH[s]} (${c})`).join("; ") : "chưa có dữ liệu."}</p>` +
      `<p><b>Thói quen cần sửa:</b> ${hb.length ? hb.map(([s, c]) => `${HAB[s]} (${c})`).join("; ") : "chưa phát hiện."}</p>` +
      `<p><b>Bài hay phải giở sổ tay (bạn nói thật là chưa hiểu, rất tốt):</b> ${unk.length ? unk.map(([i, n]) => `${T(i)} (${n} lần)`).join("; ") : "chưa có."}${asst ? ` Số lần qua kiểm tra nhờ sổ tay: ${asst}.` : ""}</p>` +
      `<p><b>Hộp ôn cách quãng</b> (1 đến 5): ${bx.join(" / ")}. Đến hạn hôm nay: ${due}. Kiểm tra nền tảng: ${HC().last ? "lần cuối " + HC().last : "chưa làm lần nào"}.</p>` +
      `<div class="fb ok"><b>Bước tiếp theo:</b> ${next}</div><p class="sub">Dữ liệu chỉ gồm điều app đo được: đúng/sai, độ chắc chắn, thời gian trả lời, dạng câu. App chưa đo số gợi ý đã dùng khi làm bài code.</p>`;
  }

  const rd0 = road;
  road = function () {
    rd0(); const b = $("#rvb"); if (!b) return; const n = dueList().length;
    b.insertAdjacentHTML("afterend", `<button class="lb g" id="lrv">Ôn cách quãng${n ? ` (${n} đến hạn)` : ""}</button><button class="lb g" id="lhc">Kiểm tra nền tảng${hcDue() ? " (đến hạn)" : ""}</button><button class="lb g" id="lpf">Hồ sơ học</button>`);
    $("#lrv").onclick = reviewSpaced; $("#lhc").onclick = healthCheck; $("#lpf").onclick = profile;
  };
  window.REV = { LT, HC, item, eligible, dueList, grade, withdraw, hcDue, foundDone, addD, DAYS, FOUND, pickShape, diagnose, reviewSpaced, healthCheck, profile };
  P.lt = P.lt || {}; P.hc = P.hc || { seen: {}, fail: {} };
  road();
})();
