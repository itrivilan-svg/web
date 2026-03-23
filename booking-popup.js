(function () {

  /* ─── CONFIG ─────────────────────────────────────── */
    const ACCESS_KEY = '2120c1bf-76e8-4bd3-87be-3e52274f5eb7';
  const TO_EMAIL      = 'janaka.apps@gmail.com';
  const SLOT_START_H  = 8;   // 8 AM
  const SLOT_END_H    = 16;  // 4 PM (last slot 3:30)
  const SLOT_STEP_MIN = 30;

  /* ─── INJECT STYLES ──────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    /* Overlay */
    #bk-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.75);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 9999;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    #bk-overlay.bk-open { display: flex; }

    /* Modal */
    #bk-modal {
      background: #0e0e0e;
      border: 1px solid rgba(103,255,1,.25);
      border-radius: 16px;
      width: 100%;
      max-width: 520px;
      max-height: 92vh;
      overflow-y: auto;
      padding: 32px;
      position: relative;
      box-shadow: 0 0 60px rgba(103,255,1,.07), 0 24px 64px rgba(0,0,0,.6);
      font-family: 'Syne', 'DM Sans', sans-serif;
      color: #e8e8e8;
      animation: bk-slide-in .3s cubic-bezier(.16,1,.3,1) both;
    }
    @keyframes bk-slide-in {
      from { opacity:0; transform: translateY(24px) scale(.97); }
      to   { opacity:1; transform: translateY(0)    scale(1);   }
    }

    /* Close */
    #bk-close {
      position: absolute;
      top: 16px; right: 20px;
      background: none;
      border: none;
      color: #666;
      font-size: 22px;
      cursor: pointer;
      line-height: 1;
      transition: color .2s;
    }
    #bk-close:hover { color: #67ff01; }

    /* Heading */
    #bk-modal h2 {
      margin: 0 0 4px;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -.5px;
      color: #fff;
    }
    #bk-modal .bk-sub {
      font-size: 13px;
      color: #555;
      margin: 0 0 24px;
    }

    /* Section labels */
    .bk-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: #67ff01;
      margin-bottom: 10px;
    }

    /* Calendar header */
    .bk-cal-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .bk-cal-nav button {
      background: none;
      border: 1px solid rgba(255,255,255,.1);
      color: #aaa;
      width: 32px; height: 32px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: border-color .2s, color .2s;
    }
    .bk-cal-nav button:hover { border-color: #67ff01; color: #67ff01; }
    .bk-cal-nav .bk-month-label {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }

    /* Day-of-week row */
    .bk-dow-row {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
      margin-bottom: 4px;
    }
    .bk-dow-row span {
      text-align: center;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: #444;
      padding: 4px 0;
    }

    /* Day grid */
    .bk-day-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      margin-bottom: 24px;
    }
    .bk-day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: background .15s, border-color .15s, color .15s;
      color: #ccc;
      background: rgba(255,255,255,.03);
      user-select: none;
    }
    .bk-day.bk-empty { background: none; border-color: transparent; cursor: default; }
    .bk-day.bk-disabled {
      color: #2a2a2a;
      background: none;
      cursor: not-allowed;
      border-color: transparent;
    }
    .bk-day.bk-past {
      color: #2a2a2a;
      background: none;
      cursor: not-allowed;
      border-color: transparent;
    }
    .bk-day.bk-today {
      border-color: rgba(103,255,1,.3);
      color: #67ff01;
    }
    .bk-day.bk-active:not(.bk-disabled):not(.bk-past):hover {
      background: rgba(103,255,1,.08);
      border-color: rgba(103,255,1,.3);
      color: #fff;
    }
    .bk-day.bk-selected {
      background: #67ff01 !important;
      border-color: #67ff01 !important;
      color: #000 !important;
      font-weight: 700;
    }

    /* Time slots */
    .bk-slots {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin-bottom: 24px;
    }
    .bk-slot {
      padding: 8px 4px;
      text-align: center;
      font-size: 12px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.03);
      cursor: pointer;
      color: #bbb;
      transition: background .15s, border-color .15s, color .15s;
      user-select: none;
    }
    .bk-slot:hover {
      background: rgba(103,255,1,.08);
      border-color: rgba(103,255,1,.3);
      color: #fff;
    }
    .bk-slot.bk-slot-selected {
      background: #67ff01;
      border-color: #67ff01;
      color: #000;
      font-weight: 700;
    }

    /* No date selected hint */
    .bk-slots-placeholder {
      font-size: 13px;
      color: #3a3a3a;
      text-align: center;
      padding: 16px 0;
      margin-bottom: 24px;
    }

    /* Email input */
    .bk-input-wrap {
      margin-bottom: 20px;
    }
    .bk-input-wrap input {
      width: 100%;
      box-sizing: border-box;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 10px;
      padding: 12px 16px;
      color: #fff;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    .bk-input-wrap input:focus {
      border-color: rgba(103,255,1,.5);
      box-shadow: 0 0 0 3px rgba(103,255,1,.06);
    }
    .bk-input-wrap input::placeholder { color: #444; }

    /* Name input */
    .bk-name-wrap {
      margin-bottom: 20px;
    }
    .bk-name-wrap input {
      width: 100%;
      box-sizing: border-box;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 10px;
      padding: 12px 16px;
      color: #fff;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    .bk-name-wrap input:focus {
      border-color: rgba(103,255,1,.5);
      box-shadow: 0 0 0 3px rgba(103,255,1,.06);
    }
    .bk-name-wrap input::placeholder { color: #444; }

    /* Send button */
    #bk-send {
      width: 100%;
      padding: 14px;
      background: #67ff01;
      color: #000;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: .04em;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-family: inherit;
      transition: opacity .2s, transform .15s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    #bk-send:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
    #bk-send:disabled { opacity: .4; cursor: not-allowed; transform: none; }

    /* Spinner */
    .bk-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(0,0,0,.3);
      border-top-color: #000;
      border-radius: 50%;
      animation: bk-spin .7s linear infinite;
      display: none;
    }
    @keyframes bk-spin { to { transform: rotate(360deg); } }

    /* Status */
    #bk-status {
      display: none;
      margin-top: 14px;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 13px;
      text-align: center;
    }

    /* Summary bar */
    #bk-summary {
      display: none;
      background: rgba(103,255,1,.06);
      border: 1px solid rgba(103,255,1,.15);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 12px;
      color: #67ff01;
      margin-bottom: 20px;
      letter-spacing: .02em;
    }

    /* Scrollbar */
    #bk-modal::-webkit-scrollbar { width: 4px; }
    #bk-modal::-webkit-scrollbar-track { background: transparent; }
    #bk-modal::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
  `;
  document.head.appendChild(style);

  /* ─── BUILD HTML ─────────────────────────────────── */
  const overlay = document.createElement('div');
  overlay.id = 'bk-overlay';
  overlay.innerHTML = `
    <div id="bk-modal" role="dialog" aria-modal="true" aria-label="Schedule a meeting">
      <button id="bk-close" aria-label="Close">&times;</button>
      <h2>Schedule a Meeting</h2>
      <p class="bk-sub">Weekdays only &nbsp;·&nbsp; 8:00 AM – 4:00 PM</p>

      <div class="bk-label">Select a date</div>
      <div class="bk-cal-nav">
        <button id="bk-prev" aria-label="Previous month">&#8249;</button>
        <span class="bk-month-label" id="bk-month-label"></span>
        <button id="bk-next" aria-label="Next month">&#8250;</button>
      </div>
      <div class="bk-dow-row">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span>
        <span>Th</span><span>Fr</span><span>Sa</span>
      </div>
      <div class="bk-day-grid" id="bk-day-grid"></div>

      <div class="bk-label">Select a time</div>
      <div id="bk-slots-wrap">
        <div class="bk-slots-placeholder">← Pick a date first</div>
      </div>

      <div id="bk-summary"></div>

      <div class="bk-label">Your name</div>
      <div class="bk-name-wrap">
        <input type="text" id="bk-name" placeholder="Jane Smith" autocomplete="name">
      </div>

      <div class="bk-label">Your email</div>
      <div class="bk-input-wrap">
        <input type="email" id="bk-email" placeholder="you@example.com" autocomplete="email">
      </div>

      <button id="bk-send" disabled>
        <span id="bk-send-text">Send Booking Request</span>
        <div class="bk-spinner" id="bk-spinner"></div>
      </button>
      <div id="bk-status"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  /* ─── STATE ──────────────────────────────────────── */
  let viewYear, viewMonth, selectedDate = null, selectedSlot = null;

  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const DAYS_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  function pad(n) { return String(n).padStart(2,'0'); }

  function fmt12(h, m) {
    const ampm = h < 12 ? 'AM' : 'PM';
    const hh   = h % 12 || 12;
    return `${hh}:${pad(m)} ${ampm}`;
  }

  /* ─── CALENDAR RENDER ────────────────────────────── */
  function renderCalendar() {
    const label = document.getElementById('bk-month-label');
    const grid  = document.getElementById('bk-day-grid');
    label.textContent = `${MONTHS[viewMonth]} ${viewYear}`;
    grid.innerHTML = '';

    const today    = new Date();
    today.setHours(0,0,0,0);
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInM  = new Date(viewYear, viewMonth + 1, 0).getDate();

    // empty cells
    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'bk-day bk-empty';
      grid.appendChild(el);
    }

    for (let d = 1; d <= daysInM; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const dow  = date.getDay();
      const el   = document.createElement('div');
      el.className = 'bk-day';
      el.textContent = d;

      const isWeekend = dow === 0 || dow === 6;
      const isPast    = date < today;
      const isToday   = date.getTime() === today.getTime();
      const isSel     = selectedDate &&
        selectedDate.getFullYear() === viewYear &&
        selectedDate.getMonth()    === viewMonth &&
        selectedDate.getDate()     === d;

      if (isPast || isWeekend) {
        el.classList.add(isPast ? 'bk-past' : 'bk-disabled');
      } else {
        el.classList.add('bk-active');
        if (isToday)  el.classList.add('bk-today');
        if (isSel)    el.classList.add('bk-selected');
        el.addEventListener('click', () => selectDate(date));
      }

      grid.appendChild(el);
    }
  }

  /* ─── SELECT DATE ────────────────────────────────── */
  function selectDate(date) {
    selectedDate = date;
    selectedSlot = null;
    renderCalendar();
    renderSlots();
    updateSummary();
    updateSendBtn();
  }

  /* ─── SLOTS RENDER ───────────────────────────────── */
  function renderSlots() {
    const wrap = document.getElementById('bk-slots-wrap');
    if (!selectedDate) {
      wrap.innerHTML = '<div class="bk-slots-placeholder">← Pick a date first</div>';
      return;
    }

    const slots = [];
    for (let h = SLOT_START_H; h < SLOT_END_H; h++) {
      slots.push({ h, m: 0  });
      slots.push({ h, m: 30 });
    }

    const grid = document.createElement('div');
    grid.className = 'bk-slots';

    slots.forEach(({ h, m }) => {
      const el  = document.createElement('div');
      el.className = 'bk-slot';
      el.textContent = fmt12(h, m);
      if (selectedSlot && selectedSlot.h === h && selectedSlot.m === m) {
        el.classList.add('bk-slot-selected');
      }
      el.addEventListener('click', () => {
        selectedSlot = { h, m };
        renderSlots();
        updateSummary();
        updateSendBtn();
      });
      grid.appendChild(el);
    });

    wrap.innerHTML = '';
    wrap.appendChild(grid);
  }

  /* ─── SUMMARY BAR ────────────────────────────────── */
  function updateSummary() {
    const bar = document.getElementById('bk-summary');
    if (selectedDate && selectedSlot) {
      const dow   = DAYS_FULL[selectedDate.getDay()];
      const dateS = `${dow}, ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
      const timeS = fmt12(selectedSlot.h, selectedSlot.m);
      bar.textContent = `✓  ${dateS}  ·  ${timeS}`;
      bar.style.display = 'block';
    } else {
      bar.style.display = 'none';
    }
  }

  /* ─── SEND BUTTON STATE ──────────────────────────── */
  function updateSendBtn() {
    const btn   = document.getElementById('bk-send');
    const email = document.getElementById('bk-email').value.trim();
    const name  = document.getElementById('bk-name').value.trim();
    btn.disabled = !(selectedDate && selectedSlot && email && name);
  }

  document.getElementById('bk-email').addEventListener('input', updateSendBtn);
  document.getElementById('bk-name').addEventListener('input',  updateSendBtn);

  /* ─── NAV BUTTONS ────────────────────────────────── */
  document.getElementById('bk-prev').addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  document.getElementById('bk-next').addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  /* ─── OPEN / CLOSE ───────────────────────────────── */
  function openModal() {
    const now  = new Date();
    viewYear   = now.getFullYear();
    viewMonth  = now.getMonth();
    selectedDate = null;
    selectedSlot = null;
    renderCalendar();
    renderSlots();
    updateSummary();
    document.getElementById('bk-email').value = '';
    document.getElementById('bk-name').value  = '';
    document.getElementById('bk-status').style.display = 'none';
    document.getElementById('bk-send').disabled = true;
    overlay.classList.add('bk-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('bk-open');
    document.body.style.overflow = '';
  }

  document.getElementById('bk-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ─── WIRE "GET IN TOUCH" BUTTON ─────────────────── */
  // Works for any button/link with id="getInTouchBtn",
  // class containing "get-in-touch", or text matching
  function wireButton(el) {
    if (!el) return;
    el.addEventListener('click', e => { e.preventDefault(); openModal(); });
  }

    wireButton(document.getElementById('getInTouchBtn'));
    wireButton(document.getElementById('scheduleCallBtn')); 
    // fallback: scan for buttons/links whose text includes "get in touch"
  document.querySelectorAll('button, a, [role="button"]').forEach(el => {
    if (el.id === 'getInTouchBtn') return;
    if (/get\s+in\s+touch|schedule\s+a\s+quick\s+call/i.test(el.textContent)) wireButton(el);
  });

  /* ─── SUBMIT ─────────────────────────────────────── */
  document.getElementById('bk-send').addEventListener('click', async () => {
    const btn     = document.getElementById('bk-send');
    const sendTxt = document.getElementById('bk-send-text');
    const spinner = document.getElementById('bk-spinner');
    const status  = document.getElementById('bk-status');

    const email = document.getElementById('bk-email').value.trim();
    const name  = document.getElementById('bk-name').value.trim();

    if (!selectedDate || !selectedSlot || !email || !name) return;

    const dow    = DAYS_FULL[selectedDate.getDay()];
    const dateS  = `${dow}, ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    const timeS  = fmt12(selectedSlot.h, selectedSlot.m);

    btn.disabled        = true;
    sendTxt.style.display = 'none';
    spinner.style.display = 'block';
    status.style.display  = 'none';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body   : JSON.stringify({
          access_key: ACCESS_KEY,
          to         : TO_EMAIL,
          subject    : `Meeting Request – ${dateS} at ${timeS}`,
          from_name  : name,
          replyto    : email,
          message    :
`New meeting booking request:

Name:    ${name}
Email:   ${email}
Date:    ${dateS}
Time:    ${timeS}

Please reply to confirm the appointment.`
        })
      });

      const data = await res.json();

      if (data.success) {
        status.style.display    = 'block';
        status.style.background = 'rgba(103,255,1,0.10)';
        status.style.border     = '1px solid rgba(103,255,1,0.35)';
        status.style.color      = '#67ff01';
        status.textContent      = `✓ Booking request sent! We'll confirm your ${timeS} slot on ${dateS}.`;
        // reset
        selectedDate = null;
        selectedSlot = null;
        renderCalendar();
        renderSlots();
        updateSummary();
        document.getElementById('bk-email').value = '';
        document.getElementById('bk-name').value  = '';
      } else {
        throw new Error(data.message || 'Submission failed');
      }

    } catch (err) {
      status.style.display    = 'block';
      status.style.background = 'rgba(255,51,51,0.10)';
      status.style.border     = '1px solid rgba(255,51,51,0.35)';
      status.style.color      = '#ff6b6b';
      status.textContent      = '✗ Something went wrong. Please try again or email us directly.';
    } finally {
      btn.disabled          = false;
      sendTxt.style.display = 'inline';
      spinner.style.display = 'none';
    }
  });

})();
