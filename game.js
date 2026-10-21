const el = document.getElementById('game');
let s;
const events = [{title:'Clouds over the stars',text:'A thick cloud bank hides the stars that guide your canoe. The swells still carry clues.',choices:[['Follow the ocean swells',0,0,0,1,"Ocean swells can help you hold a course when stars are hidden, especially when you have already observed their direction."],['Wait for the sky to clear',-1,-1,0,2,"Waiting for visible stars can reduce uncertainty about your heading, but the crew still needs supplies while you wait."],['Guess a direction',0,0,-2,0,"Choosing a heading without checking natural clues risks taking the canoe off course."]]},{title:'A school of fish',text:'Flying fish scatter across the waves. Your crew spots signs of life beneath the surface.',choices:[['Fish together',2,-1,1,1,"Sharing the work of fishing helps the crew gather food and cooperate."],['Keep sailing',-1,0,0,2,"Continuing the voyage saves time, but passes up a chance to replenish food."],['Spend the day fishing',3,-2,0,0,"Longer fishing stops may provide more food, but they also take time and drinking water."]]},{title:'The squall',text:'Dark clouds race toward the canoe. Wind tears at the sail.',choices:[['Reef the sail and ride it out',-1,-1,0,2,"Reefing means reducing sail area so strong winds put less strain on the canoe."],['Race ahead of the storm',0,-2,-2,0,"Trying to outrun a storm can expose the crew and canoe to stronger winds; speed alone does not ensure safety."],['Turn into the swells',-1,0,-1,1,"How a canoe meets the swells affects its motion and stability; steering requires watching the waves and adjusting."]]},{title:'A tired crew',text:'The voyage has been long. Someone asks whether you can spare more drinking water.',choices:[['Share extra water',-2,0,2,1,"Sharing extra water meets an immediate crew need, but leaves less for the rest of the voyage."],['Keep strict rations',0,0,-1,2,"Rationing aims to make supplies last; explaining the reason helps the crew understand a difficult limit."],['Rest and tell stories',-1,-1,2,1,"Rest and storytelling give people time to recover and strengthen their sense of shared purpose."]]},{title:'Birds at sunrise',text:'At dawn, seabirds fly across the horizon. Their flight may point toward land.',choices:[['Follow their morning flight',-1,0,1,2,"Some seabirds fly out to feed in the morning, so following them may lead away from land; bird type and time of day matter."],['Trust your current heading',-1,0,0,1,"Holding a heading avoids reacting to a single uncertain clue, but navigators keep checking other signs."],['Circle to watch their return',-2,-1,0,2,"Watching where land-roosting birds return later in the day can offer a land clue, though not all seabirds return to land each day."]]},{title:'A leak in the hull',text:'A seam lets seawater into the canoe. Everyone looks to you.',choices:[['Repair it immediately',-1,-2,1,2,"Repairing a leak addresses the source of incoming water before the problem grows."],['Bail water and continue',-1,0,-1,0,"Bailing removes water already inside the canoe, but the leak still needs repair."],['Ask the crew to solve it together',-1,-1,2,1,"Inviting the crew to solve a problem draws on their skills and builds shared responsibility."]]}];
// An illustrated journey, not a geographic map or a historical route.
function journey(fromProgress = s ? s.progress : 0) {
  const progress = Math.max(0, Math.min(1, (s ? s.progress : 0) / 19));
  const previous = Math.max(0, Math.min(1, fromProgress / 19));
  const percent = Math.round(progress * 100);
  const event = s ? (s.day - 1) % events.length : -1;
  const weather = s && s.done === 'won' ? 'day' : ['night', 'day', 'storm', 'sunset', 'dawn', 'day'][event] || 'dawn';
  const stopped = !s || !!s.done;
  const phase = !s ? 'Ready to set sail' : s.done === 'won' ? 'Landfall in Hawaiʻi' : s.done === 'lost' ? 'Voyage ended' : progress < .25 ? 'Leaving familiar shores' : progress < .7 ? 'Across the open Pacific' : progress < .9 ? 'The far horizon' : 'Land on the horizon';
  const conditions = {night: 'Clouds hide the stars', day: 'Ocean swells', storm: 'A squall approaches', sunset: 'Evening at sea', dawn: 'First light'};
  const landScale = .25 + Math.max(0, (progress - .7) / .3) * .75;
  return `<figure class="journey ${stopped ? 'journey-stopped' : ''}" style="--canoe-from:${145 + previous * 420}px;--canoe-to:${145 + progress * 420}px;--route-from:${previous * 100}%;--route-to:${progress * 100}%">
    <div class="journey-scene" data-weather="${weather}" aria-hidden="true">
      <div class="journey-heading"><span>THE PACIFIC CROSSING</span><span>${s ? 'DAY ' + s.day : 'YOUR VOYAGE AWAITS'}</span></div>
      <svg class="journey-art" viewBox="0 0 800 330" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <linearGradient id="journey-sky" x2="0" y2="1"><stop class="sky-top"/><stop class="sky-bottom" offset="1"/></linearGradient>
          <linearGradient id="journey-sea" x2="0" y2="1"><stop stop-color="#318e9e"/><stop offset="1" stop-color="#0b3d55"/></linearGradient>
          <pattern id="journey-waves" width="160" height="44" patternUnits="userSpaceOnUse"><path d="M8 12h30m48 20h45m-78 0h12" stroke="#78c8c6" stroke-width="3" opacity=".5"/></pattern>
        </defs>
        <path fill="url(#journey-sky)" d="M0 0h800v184H0z"/>
        <g class="scene-stars" fill="#e7eedb"><path d="M92 65h3v3h-3zM212 38h3v3h-3zM385 70h4v4h-4zM592 58h3v3h-3zM722 98h3v3h-3zM455 32h3v3h-3zM324 112h3v3h-3z"/><path d="M647 42h4v16h-4zM641 48h16v4h-16z"/></g>
        <circle class="scene-sun" cx="610" cy="112" r="29" fill="#f9df9e"/>
        <g class="scene-clouds" fill="#e8e5cc"><path d="M44 88h20V77h34V67h40v10h33v11h22v12H44z"/><path d="M388 71h22V60h30V50h45v10h35v11h22v11H388z"/><path d="M682 119h20v-12h39v-8h30v8h29v24H682z"/></g>
        <g class="scene-storm-clouds" fill="#3b4c60"><path d="M0 66h65V51h80v15h60V51h85V38h100v17h75V39h90v21h85V48h92v20h68v54H0z"/><path d="M0 106h800v30h-70v15h-95v-10H520v14H415v-15H305v12H176v-15H72v14H0z" fill="#4b6070"/></g>
        <path fill="#a7c4b5" opacity=".35" d="M0 176h800v9H0z"/>
        <g class="departure-island" opacity="${Math.max(0, 1 - progress / .3)}" transform="translate(${-progress * 260} 0)"><path d="M0 180v-46l28-5 30-47 23 18 23 41 34 12 33 27z" fill="#315b59"/><path d="M0 178l70-18 81 16 22 9H0z" fill="#cbbe86"/><path d="M31 164l-3-45h5l5 45z" fill="#564d36"/><path d="M29 121l-28-5 12-9 17 8 15-14 19 5-30 14 25 14-24-5-9 15z" fill="#3a7360"/></g>
        <g class="destination-island" opacity="${progress >= .7 ? 1 : 0}" transform="translate(706 183) scale(${landScale})"><path d="M-109 0l34-27 24-54 23 16 27-45 25 22 18 42 33 13 40 33z" fill="#366d64"/><path d="M-109 0l39-19 40-17 25 15 49-20 34 16 37 25z" fill="#53876b"/><path d="M-116 0l59-7h112l64 7v5h-235z" fill="#e6cc8e"/></g>
        <path fill="url(#journey-sea)" d="M0 185h800v145H0z"/>
        <path fill="#aad5c8" opacity=".3" d="M0 185h800v3H0z"/>
        <g class="moving-waves"><path fill="url(#journey-waves)" d="M-160 190h1120v140H-160z"/></g>
        <g class="scene-birds" fill="none" stroke="#274a58" stroke-width="3" opacity="${event === 4 || progress > .9 ? 1 : 0}"><path d="M545 95q10-10 20 0 10-10 20 0M625 118q8-8 16 0 8-8 16 0M492 120q7-7 14 0 7-7 14 0"/></g>
        <g class="scene-fish" fill="#b0ddd1" opacity="${event === 1 && !s.done ? 1 : 0}"><path d="M290 278l12-6 12 6-12 5zM314 278l7-6v12zM645 240l12-6 12 6-12 5zM669 240l7-6v12z"/></g>
        <g transform="translate(0 252)"><g class="journey-canoe"><g class="canoe-bob">
          <ellipse cx="0" cy="25" rx="104" ry="8" fill="#092f45" opacity=".45"/>
          <path d="M-93-5h174l-15 13H-70z" fill="#75503a" stroke="#c08b57" stroke-width="3"/>
          <path d="M-64-8v24m100-24v24" stroke="#d9b67c" stroke-width="6"/>
          <path d="M-91 12H89L69 27H-68z" fill="#8e5c3e" stroke="#d5a36b" stroke-width="3"/>
          <path d="M-78 16H74" stroke="#e3bb7d" stroke-width="3"/>
          <path d="M-7-8v-123" stroke="#6c503a" stroke-width="5"/>
          <path d="M-1-126Q40-94 69-36L-1-22z" fill="#f3ddb0" stroke="#c3a476" stroke-width="2"/>
          <path d="M7-111l40 75M3-78l49 32M3-48l34 9" stroke="#ceab78" stroke-width="2" fill="none"/>
          <path d="M-9-115L-56-19H-9z" fill="#d7b987"/>
          <path d="M-8-127L-73 7M-8-127L78 6" stroke="#a7a083" fill="none"/>
          <g fill="#533d36"><circle cx="-39" cy="-18" r="5"/><path d="M-44-12h10v16h-10z"/><circle cx="22" cy="-13" r="5"/><path d="M17-7h10V8H17z"/><circle cx="49" cy="-13" r="5"/><path d="M44-7h10V8H44z"/></g>
          <path d="M48-3l25 32" stroke="#dbc28f" stroke-width="3"/>
        </g></g></g>
        <g class="scene-rain" stroke="#bddeeb" stroke-width="2" opacity=".5"><path d="M70 151l-13 27m60-21-13 27m72-32-13 27m84-26-13 27m75-28-13 27m85-31-13 27m75-25-13 27m73-33-13 27m82-23-13 27m74-34-13 27m76-20-13 27m70-33-13 27"/></g>
      </svg>
      <div class="journey-conditions">${s && s.done ? phase : conditions[weather]}</div>
    </div>
    <figcaption>
      <div class="journey-caption"><strong>${phase}</strong><span>${percent}% of voyage</span></div>
      <div class="journey-route" role="progressbar" aria-label="Voyage progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span class="route-fill"></span><span class="route-marker" aria-hidden="true">▴</span></div>
      <div class="journey-labels"><span>Departure</span><span>Illustrated route</span><span>Hawaiʻi</span></div>
    </figcaption>
  </figure>`;
}

function start() {
  s = {day: 1, food: 12, water: 12, spirit: 7, hull: 8, progress: 0, log: 'Your double-hulled canoe leaves familiar shores. Ahead lies the vast Pacific.', done: false};
  render();
}

function clamp(n) { return Math.max(0, Math.min(15, n)); }

function choose(i) {
  if (s.done) return;
  const e = events[(s.day - 1) % events.length], c = e.choices[i];
  const previousProgress = s.progress;
  s.food = clamp(s.food + c[1]);
  s.water = clamp(s.water + c[0]);
  s.spirit = clamp(s.spirit + c[2]);
  s.hull = clamp(s.hull + c[3]);
  s.progress += 1 + Math.max(0, c[4] || 0);
  s.log = 'You chose: ' + c[0] + '. What this teaches: ' + c[5];
  s.day++;
  if (s.food === 0 || s.water === 0 || s.hull === 0 || s.spirit === 0) {
    s.done = 'lost';
    s.log += ' The crew can no longer safely continue.';
  } else if (s.progress >= 19) {
    s.done = 'won';
    s.log += ' Land rises on the horizon. You have reached Hawaiʻi!';
  }
  render(previousProgress);
}

function render(fromProgress) {
  if (!s) {
    el.innerHTML = journey() + '<h2>The journey begins</h2><p class="story">You are the navigator. Every choice changes your crew’s chances of reaching a new island home.</p><button id="begin">Launch the canoe →</button>';
    document.getElementById('begin').onclick = start;
    return;
  }
  const e = events[(s.day - 1) % events.length];
  el.innerHTML = journey(fromProgress) + '<div class="stats">' + [['Day', s.day], ['Food', s.food], ['Water', s.water], ['Crew spirit', s.spirit], ['Hull', s.hull], ['Distance', Math.min(100, Math.round(s.progress / 19 * 100)) + '%']].map(a => '<div class="stat">' + a[0] + '<strong>' + a[1] + '</strong></div>').join('') + '</div><h2>' + (s.done ? (s.done === 'won' ? 'Landfall!' : 'Voyage ended') : e.title) + '</h2><p class="story">' + (s.done ? s.log : e.text) + '</p><p class="message">' + (s.done ? '' : s.log) + '</p><div id="choices"></div>';
  const area = document.getElementById('choices');
  if (s.done) {
    const b = document.createElement('button');
    b.textContent = 'Voyage again ↻';
    b.onclick = start;
    area.append(b);
  } else e.choices.forEach((c, i) => {
    const b = document.createElement('button');
    b.textContent = c[0];
    b.onclick = () => choose(i);
    area.append(b);
  });
}
render();
