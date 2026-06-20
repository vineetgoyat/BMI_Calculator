/* =====================================================
   BMI Analyzer — JavaScript Logic
   Full health analysis, animations, particles
===================================================== */

// =====================================================
// STATE
// =====================================================
let selectedGender = 'male';
let selectedUnit = 'metric';

// =====================================================
// GENDER & UNIT TOGGLE
// =====================================================
function selectGender(g) {
  selectedGender = g;
  document.getElementById('btn-male').classList.toggle('active', g === 'male');
  document.getElementById('btn-female').classList.toggle('active', g === 'female');
}

function selectUnit(u) {
  selectedUnit = u;
  document.getElementById('btn-metric').classList.toggle('active', u === 'metric');
  document.getElementById('btn-imperial').classList.toggle('active', u === 'imperial');
  document.getElementById('height-unit').textContent = u === 'metric' ? 'cm' : 'in';
  document.getElementById('weight-unit').textContent = u === 'metric' ? 'kg' : 'lb';
  document.getElementById('height').placeholder = u === 'metric' ? '170' : '67';
  document.getElementById('weight').placeholder = u === 'metric' ? '70' : '154';
}

// =====================================================
// BMI CALCULATION
// =====================================================
function calculateBMI() {
  const ageVal    = parseFloat(document.getElementById('age').value);
  const heightVal = parseFloat(document.getElementById('height').value);
  const weightVal = parseFloat(document.getElementById('weight').value);
  const activity  = document.getElementById('activity').value;

  if (!ageVal || !heightVal || !weightVal || ageVal <= 0 || heightVal <= 0 || weightVal <= 0) {
    shakeButton();
    showToast('⚠️ Please fill all fields with valid values!');
    return;
  }

  // Convert to metric if imperial
  let heightM, weightKg;
  if (selectedUnit === 'metric') {
    heightM  = heightVal / 100;
    weightKg = weightVal;
  } else {
    heightM  = heightVal * 0.0254;
    weightKg = weightVal * 0.453592;
  }

  const bmi = weightKg / (heightM * heightM);
  const category = getBMICategory(bmi, ageVal);
  const idealMin = 18.5 * heightM * heightM;
  const idealMax = 24.9 * heightM * heightM;
  const tdee     = calculateTDEE(weightKg, heightM * 100, ageVal, selectedGender, activity);
  const water    = Math.round((weightKg * 35) / 1000 * 10) / 10;

  // Update UI
  renderResults(bmi, category, idealMin, idealMax, tdee, water, weightKg);
}

function getBMICategory(bmi, age) {
  if (bmi < 18.5) return { name: 'Underweight', slug: 'underweight', color: '#60a5fa' };
  if (bmi < 25)   return { name: 'Normal Weight', slug: 'normal',      color: '#34d399' };
  if (bmi < 30)   return { name: 'Overweight',    slug: 'overweight',  color: '#fbbf24' };
  return           { name: 'Obese',              slug: 'obese',       color: '#f87171' };
}

function calculateTDEE(weight, heightCm, age, gender, activity) {
  // Mifflin–St Jeor
  let bmr;
  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) - 161;
  }
  const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extreme: 1.9 };
  return Math.round(bmr * (factors[activity] || 1.55));
}

// =====================================================
// HEALTH DATA BY CATEGORY
// =====================================================
function getHealthData(slug, bmi, gender) {
  const data = {
    underweight: {
      pros: [
        { icon: '💨', title: 'Lower Joint Stress', text: 'Less pressure on your knees, hips and lower back during daily activities.' },
        { icon: '🚶', title: 'Mobility Advantage', text: 'Lighter body weight can make it easier to move quickly and feel agile.' },
        { icon: '❤️', title: 'Lower Blood Pressure Risk', text: 'Underweight individuals may have lower resting blood pressure.' },
        { icon: '🌡️', title: 'Reduced Heat Sensitivity', text: 'Lower body mass means you may feel less overheated in warm environments.' },
      ],
      cons: [
        { icon: '🦴', title: 'Weak Bones & Osteoporosis', text: 'Low body weight is associated with reduced bone density, increasing fracture risk.' },
        { icon: '💪', title: 'Muscle Loss (Sarcopenia)', text: 'Without adequate nutrition, the body may break down muscle for energy.' },
        { icon: '🛡️', title: 'Weakened Immune System', text: 'Malnutrition leads to decreased immune function and higher infection risk.' },
        { icon: '😴', title: 'Chronic Fatigue', text: 'Insufficient caloric intake often causes persistent tiredness and low energy.' },
        { icon: '🧠', title: 'Hormonal Imbalances', text: 'Low body fat can disrupt hormone production, affecting fertility and mood.' },
      ],
      improvements: [
        { emoji: '🍗', title: 'Protein-Rich Diet', desc: 'Aim for 1.2–2g of protein per kg of body weight. Include chicken, eggs, fish, legumes.' },
        { emoji: '🏋️', title: 'Strength Training', desc: 'Lift weights 3–4 times a week to build lean muscle mass safely.' },
        { emoji: '🥑', title: 'Healthy Caloric Surplus', desc: 'Add 300–500 calories/day via healthy fats like avocado, nuts, olive oil.' },
        { emoji: '🥛', title: 'Nutrient-Dense Snacks', desc: 'Add whole milk, Greek yogurt, banana smoothies between meals.' },
        { emoji: '🩺', title: 'Medical Check-Up', desc: 'Rule out thyroid issues, gastrointestinal conditions, or nutritional deficiencies.' },
        { emoji: '😴', title: 'Quality Sleep', desc: 'Muscle repair and healthy weight gain require 7–9 hours of uninterrupted sleep.' },
      ],
      weekly: [
        { day: 'MON', emoji: '🏋️', activity: 'Upper Body Strength' },
        { day: 'TUE', emoji: '🧘', activity: 'Yoga & Flexibility' },
        { day: 'WED', emoji: '🏋️', activity: 'Lower Body Strength' },
        { day: 'THU', emoji: '🚴', activity: 'Light Cardio 20 min' },
        { day: 'FRI', emoji: '🏋️', activity: 'Full Body Compound' },
        { day: 'SAT', emoji: '🚶', activity: 'Active Walk + Stretch' },
        { day: 'SUN', emoji: '🛌', activity: 'Rest & Recovery' },
      ],
    },
    normal: {
      pros: [
        { icon: '❤️', title: 'Healthy Cardiovascular System', text: 'Normal BMI correlates with lower risk of heart disease and stroke.' },
        { icon: '🔋', title: 'Optimal Energy Levels', text: 'Your body is efficiently converting nutrients to fuel, keeping energy stable.' },
        { icon: '🦴', title: 'Strong Bone Density', text: 'Adequate weight supports healthy bone mineral density.' },
        { icon: '😴', title: 'Better Sleep Quality', text: 'Normal weight reduces sleep apnea risk and improves deep sleep cycles.' },
        { icon: '🧠', title: 'Mental Wellbeing', text: 'Healthy weight is associated with lower rates of depression and anxiety.' },
        { icon: '🛡️', title: 'Resilient Immune System', text: 'Your body has the nutritional reserves to fight off illness effectively.' },
      ],
      cons: [
        { icon: '📏', title: 'BMI Doesn\'t Measure Fat %', text: 'You could still have high body fat but appear "normal" on BMI scale.' },
        { icon: '💪', title: 'Risk of Muscle Complacency', text: 'Without exercise, muscle mass can decline even at a normal BMI.' },
        { icon: '🍕', title: 'Metabolic Risk Still Possible', text: 'Diet quality matters — poor eating habits can cause metabolic issues despite normal BMI.' },
        { icon: '📈', title: 'BMI Can Change With Age', text: 'Metabolism slows with age; maintaining normal BMI requires continuous effort.' },
      ],
      improvements: [
        { emoji: '🏃', title: 'Maintain Cardio Fitness', desc: 'Do 150 min/week of moderate aerobic exercise (walking, cycling, swimming).' },
        { emoji: '🏋️', title: 'Preserve Muscle Mass', desc: 'Incorporate strength training 2–3 times a week to maintain lean body composition.' },
        { emoji: '🥗', title: 'Optimize Diet Quality', desc: 'Focus on whole foods: colorful vegetables, lean proteins, healthy fats, whole grains.' },
        { emoji: '💧', title: 'Stay Hydrated', desc: 'Drink 2–3 liters of water daily. Dehydration affects metabolism and energy.' },
        { emoji: '🧘', title: 'Stress Management', desc: 'Chronic stress causes cortisol spikes that promote fat storage — meditate or practice mindfulness.' },
        { emoji: '🩺', title: 'Regular Health Checks', desc: 'Annual blood tests for cholesterol, blood sugar, and vitamin levels.' },
      ],
      weekly: [
        { day: 'MON', emoji: '🏃', activity: 'Run 30 min Moderate' },
        { day: 'TUE', emoji: '🏋️', activity: 'Strength Training' },
        { day: 'WED', emoji: '🚴', activity: 'Cycling or Swim' },
        { day: 'THU', emoji: '🧘', activity: 'Yoga / Pilates' },
        { day: 'FRI', emoji: '🏋️', activity: 'Full Body Strength' },
        { day: 'SAT', emoji: '⛰️', activity: 'Hike / Outdoor' },
        { day: 'SUN', emoji: '🛌', activity: 'Rest & Stretch' },
      ],
    },
    overweight: {
      pros: [
        { icon: '💪', title: 'Potential Muscle Reserve', text: 'Some overweight individuals carry significant muscle, especially if active.' },
        { icon: '🦴', title: 'Bone Strength Buffer', text: 'Slightly higher weight can be protective against osteoporosis in older adults.' },
        { icon: '🌡️', title: 'Cold Tolerance', text: 'Extra body fat provides insulation and may help in colder climates.' },
        { icon: '⚡', title: 'Energy Reserves', text: 'Body fat stores provide fuel during prolonged fasting or illness recovery.' },
      ],
      cons: [
        { icon: '❤️', title: 'Elevated Heart Disease Risk', text: 'Excess fat raises LDL cholesterol, blood pressure, and cardiovascular strain.' },
        { icon: '🩸', title: 'Pre-Diabetic Indicators', text: 'Overweight increases insulin resistance, a precursor to Type 2 diabetes.' },
        { icon: '🦵', title: 'Joint Pain & Inflammation', text: 'Extra weight puts stress on knees and hips, accelerating cartilage wear.' },
        { icon: '😴', title: 'Sleep Apnea Risk', text: 'Fat deposits around the neck can narrow airways, disrupting breathing during sleep.' },
        { icon: '🧠', title: 'Mental Health Impact', text: 'Body image concerns and fatigue from carrying extra weight can affect mood.' },
      ],
      improvements: [
        { emoji: '🚶', title: 'Start Walking Daily', desc: 'Walk 30–45 minutes every day. It burns calories, reduces stress, and is easy on joints.' },
        { emoji: '🥗', title: 'Caloric Deficit Diet', desc: 'Reduce intake by 300–500 calories/day. Cut sugary drinks, processed snacks, white bread.' },
        { emoji: '💪', title: 'Resistance Training', desc: 'Muscle burns more calories at rest. Start with bodyweight exercises 3x/week.' },
        { emoji: '🚫', title: 'Cut Ultra-Processed Foods', desc: 'Replace chips, fast food, packaged snacks with whole foods — fruits, veggies, lean meats.' },
        { emoji: '📊', title: 'Track What You Eat', desc: 'Use an app to log meals. Awareness alone reduces caloric intake by 10–20%.' },
        { emoji: '🩺', title: 'Check Metabolic Markers', desc: 'Get blood sugar, cholesterol, and blood pressure checked to identify hidden risks.' },
      ],
      weekly: [
        { day: 'MON', emoji: '🚶', activity: 'Brisk Walk 40 min' },
        { day: 'TUE', emoji: '🏊', activity: 'Swimming / Low Impact' },
        { day: 'WED', emoji: '🏋️', activity: 'Light Strength Training' },
        { day: 'THU', emoji: '🚴', activity: 'Stationary Bike 30 min' },
        { day: 'FRI', emoji: '🧘', activity: 'Yoga & Core' },
        { day: 'SAT', emoji: '🚶', activity: 'Long Walk + Stretch' },
        { day: 'SUN', emoji: '🛌', activity: 'Rest & Recovery' },
      ],
    },
    obese: {
      pros: [
        { icon: '💪', title: 'Strong Motivation Catalyst', text: 'Many people at this stage find powerful motivation to transform their health entirely.' },
        { icon: '🌡️', title: 'Cold & Energy Reserves', text: 'High body fat provides thermal insulation and significant energy storage.' },
        { icon: '🦴', title: 'Bone Load Adaptation', text: 'Bones may be denser due to carrying extra load, though this has limits.' },
        { icon: '🔄', title: 'Huge Improvement Potential', text: 'Even a 5–10% weight loss dramatically reduces health risks — change is very possible.' },
      ],
      cons: [
        { icon: '❤️', title: 'High Cardiovascular Risk', text: 'Significantly elevated risk of heart attack, stroke, and heart failure.' },
        { icon: '🩸', title: 'Type 2 Diabetes', text: 'Obesity is the #1 modifiable risk factor for Type 2 diabetes development.' },
        { icon: '🫁', title: 'Respiratory Issues', text: 'Excess weight compresses the lungs, causing shortness of breath and sleep apnea.' },
        { icon: '🦵', title: 'Severe Joint Damage', text: 'Every extra kg puts 4kg of pressure on knees — accelerating arthritis and damage.' },
        { icon: '🧠', title: 'Cognitive Health Risk', text: 'Obesity is linked to higher risk of dementia, depression, and anxiety disorders.' },
        { icon: '🎗️', title: 'Increased Cancer Risk', text: 'Obesity is associated with 13 types of cancer including colorectal and breast cancer.' },
      ],
      improvements: [
        { emoji: '🩺', title: 'See a Doctor First', desc: 'Get a full health assessment before starting exercise. Check for diabetes, heart conditions.' },
        { emoji: '🚶', title: 'Low-Impact Movement', desc: 'Walking, swimming, water aerobics — protect joints while burning calories consistently.' },
        { emoji: '🥗', title: 'Anti-Inflammatory Diet', desc: 'Focus on vegetables, fiber, and lean protein. Eliminate sugar-sweetened beverages completely.' },
        { emoji: '🧠', title: 'Behavioral Support', desc: 'Work with a dietitian or therapist to address emotional eating and build lasting habits.' },
        { emoji: '😴', title: 'Prioritize Sleep', desc: 'Poor sleep raises hunger hormones (ghrelin) and lowers satiety (leptin). Aim for 8 hours.' },
        { emoji: '📉', title: 'Small Goals = Big Wins', desc: 'A 5% weight loss reduces diabetes risk by 50%. Every step forward matters enormously.' },
      ],
      weekly: [
        { day: 'MON', emoji: '🚶', activity: 'Gentle Walk 20 min' },
        { day: 'TUE', emoji: '🏊', activity: 'Water Aerobics / Pool' },
        { day: 'WED', emoji: '🧘', activity: 'Chair Yoga / Stretch' },
        { day: 'THU', emoji: '🚶', activity: 'Walk + Breathing Ex.' },
        { day: 'FRI', emoji: '💪', activity: 'Seated Resistance Band' },
        { day: 'SAT', emoji: '🛶', activity: 'Light Outdoor Activity' },
        { day: 'SUN', emoji: '🛌', activity: 'Full Rest & Recovery' },
      ],
    },
  };
  return data[slug] || data.normal;
}

// =====================================================
// RENDER RESULTS
// =====================================================
function renderResults(bmi, category, idealMin, idealMax, tdee, water, weightKg) {
  const section = document.getElementById('results');
  const calcSection = document.getElementById('calculator');

  // Badge
  const badge = document.getElementById('result-badge');
  badge.textContent = category.name;
  badge.className = `result-badge badge-${category.slug}`;

  // BMI display with counter animation
  animateNumber('bmi-display', 0, bmi, 1, 1200);
  document.getElementById('bmi-category').textContent = category.name;
  document.getElementById('bmi-category').style.color = category.color;

  // Ideal weight
  const idealMinKg = parseFloat(idealMin.toFixed(1));
  const idealMaxKg = parseFloat(idealMax.toFixed(1));
  const diff = weightKg - idealMax;
  let idealText = `${idealMinKg}–${idealMaxKg} kg`;
  if (diff > 0.5) idealText += ` (↓ ${diff.toFixed(1)} kg to lose)`;
  else if (weightKg < idealMin - 0.5) idealText += ` (↑ ${(idealMin - weightKg).toFixed(1)} kg to gain)`;
  document.getElementById('ideal-weight').textContent = idealText;

  // TDEE & Water
  document.getElementById('calories').textContent = `${tdee.toLocaleString()} kcal/day`;
  document.getElementById('water-intake').textContent = `${water} L/day`;

  // Gauge needle
  animateGauge(bmi, category);

  // Health data
  const data = getHealthData(category.slug, bmi, selectedGender);

  // Pros
  const prosList = document.getElementById('pros-list');
  prosList.innerHTML = data.pros.map((p, i) => `
    <li style="animation-delay:${i * 0.08}s">
      <span class="li-icon">${p.icon}</span>
      <span class="li-text"><span class="li-title">${p.title}</span>${p.text}</span>
    </li>
  `).join('');

  // Cons
  const consList = document.getElementById('cons-list');
  consList.innerHTML = data.cons.map((c, i) => `
    <li style="animation-delay:${i * 0.08}s">
      <span class="li-icon">${c.icon}</span>
      <span class="li-text"><span class="li-title">${c.title}</span>${c.text}</span>
    </li>
  `).join('');

  // Improvements
  const grid = document.getElementById('improvements-grid');
  grid.innerHTML = data.improvements.map((imp, i) => `
    <div class="improve-item" style="animation-delay:${i * 0.07}s">
      <div class="improve-emoji">${imp.emoji}</div>
      <div class="improve-title">${imp.title}</div>
      <div class="improve-desc">${imp.desc}</div>
    </div>
  `).join('');

  // Weekly plan
  const today = new Date().getDay(); // 0=Sun
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Sun=index6 in our array
  const weeklyGrid = document.getElementById('weekly-grid');
  weeklyGrid.innerHTML = data.weekly.map((d, i) => `
    <div class="day-card ${dayMap[today] === i ? 'active-day' : ''}" style="animation-delay:${i * 0.06}s">
      <div class="day-name">${d.day}</div>
      <span class="day-emoji">${d.emoji}</span>
      <div class="day-activity">${d.activity}</div>
    </div>
  `).join('');

  // Show results
  section.style.display = 'block';
  calcSection.style.display = 'none';

  // Smooth scroll
  setTimeout(() => {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// =====================================================
// GAUGE ANIMATION
// =====================================================
function animateGauge(bmi, category) {
  // Map BMI 16–40 to -90deg to +90deg
  const clampedBMI = Math.min(Math.max(bmi, 16), 40);
  const rotation = ((clampedBMI - 16) / (40 - 16)) * 180 - 90;

  const needle = document.getElementById('gauge-needle');
  const label  = document.getElementById('gauge-label');

  needle.style.transition = 'transform 1.2s cubic-bezier(0.34,1.56,0.64,1)';
  needle.setAttribute('transform', `rotate(${rotation}, 150, 160)`);
  label.textContent = category.name;
  label.style.color = category.color;
}

// =====================================================
// ANIMATE NUMBER
// =====================================================
function animateNumber(elId, from, to, decimals, duration) {
  const el = document.getElementById(elId);
  const start = performance.now();
  const diff = to - from;

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 4);
    const val = from + diff * ease;
    el.textContent = val.toFixed(decimals);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// =====================================================
// RESET
// =====================================================
function resetCalculator() {
  document.getElementById('results').style.display = 'none';
  document.getElementById('calculator').style.display = 'block';
  document.getElementById('age').value = '';
  document.getElementById('height').value = '';
  document.getElementById('weight').value = '';
  window.scrollTo({ top: document.getElementById('calculator').offsetTop - 80, behavior: 'smooth' });
}

// =====================================================
// SHAKE BUTTON (validation)
// =====================================================
function shakeButton() {
  const btn = document.getElementById('calculate-btn');
  btn.style.animation = 'shake 0.5s ease';
  btn.addEventListener('animationend', () => { btn.style.animation = ''; }, { once: true });
}

// Inject shake keyframes
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    15% { transform: translateX(-6px); }
    30% { transform: translateX(6px); }
    45% { transform: translateX(-4px); }
    60% { transform: translateX(4px); }
    75% { transform: translateX(-2px); }
    90% { transform: translateX(2px); }
  }
`;
document.head.appendChild(shakeStyle);

// =====================================================
// TOAST
// =====================================================
function showToast(message) {
  const existing = document.querySelector('.bmi-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'bmi-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: rgba(30,10,50,0.95); border: 1px solid rgba(139,92,246,0.4);
    color: #f1f0fb; padding: 14px 24px; border-radius: 50px;
    font-size: 14px; font-weight: 600; font-family: 'Outfit',sans-serif;
    backdrop-filter: blur(20px); z-index: 9999;
    opacity: 0; transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// =====================================================
// PARTICLES CANVAS
// =====================================================
(function initParticles() {
  const canvas  = document.getElementById('particles-canvas');
  const ctx     = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '139,92,246' : '236,72,153',
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  draw();
})();

// =====================================================
// SCROLL REVEAL
// =====================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.glass-card, .about-card, .section-header').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// =====================================================
// HEADER SCROLL EFFECT
// =====================================================
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.style.background = 'rgba(13,1,24,0.95)';
    header.style.boxShadow = '0 4px 32px rgba(0,0,0,0.4)';
  } else {
    header.style.background = 'rgba(13,1,24,0.8)';
    header.style.boxShadow = 'none';
  }
});

// =====================================================
// SMOOTH NAV SCROLL
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// =====================================================
// HERO CIRCLE PULSE ANIMATION
// =====================================================
(function heroAnimation() {
  let angle = 0;
  const arc = document.querySelector('.progress-arc');
  if (!arc) return;
  function pulse() {
    angle += 0.005;
    const offset = 134 + Math.sin(angle) * 20;
    arc.setAttribute('stroke-dashoffset', offset.toString());
    requestAnimationFrame(pulse);
  }
  pulse();
})();

// =====================================================
// CURSOR GLOW (subtle)
// =====================================================
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%);
    transform: translate(-50%,-50%);
    transition: opacity 0.3s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// =====================================================
// INPUT VALIDATION — Live feedback
// =====================================================
['age', 'height', 'weight'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    const val = parseFloat(el.value);
    if (el.value && (isNaN(val) || val <= 0)) {
      el.style.borderColor = '#f87171';
      el.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.15)';
    } else if (el.value) {
      el.style.borderColor = '#34d399';
      el.style.boxShadow = '0 0 0 3px rgba(52,211,153,0.15)';
    } else {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }
  });
});

// =====================================================
// KEYBOARD SUPPORT — Enter to calculate
// =====================================================
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const resultsVisible = document.getElementById('results').style.display !== 'none';
    if (!resultsVisible) calculateBMI();
  }
});
