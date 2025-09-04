(function() {
  // Prevent duplicate panel
  if (document.getElementById("aura-sidebar")) return;

  // Create sidebar iframe
  const iframe = document.createElement("iframe");
  iframe.id = "aura-sidebar";
  iframe.src = chrome.runtime.getURL("panel.html");

  // Sidebar styles
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.right = "0";
  iframe.style.width = "380px";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.zIndex = "999999";
  iframe.style.boxShadow = "-2px 0 8px rgba(0,0,0,0.2)";
  iframe.style.background = "#111722";

  document.body.appendChild(iframe);
})();
