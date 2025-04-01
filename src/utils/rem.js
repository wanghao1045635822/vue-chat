function setRemUnit() {
  const html = document.documentElement;
  const width = html.clientWidth;
  const rem = width / 100; // 根据屏幕宽度计算 rem 值
  html.style.fontSize = `${rem}px`;
}

// 初始化
setRemUnit();

// 监听窗口大小变化
window.addEventListener('resize', setRemUnit);
