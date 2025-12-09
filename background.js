chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: runSummarizerOnPage
  });
});

// Runs in the page context
async function runSummarizerOnPage() {
  try {
    if (!('Summarizer' in self)) {
      alert('Summarizer API not available in this tab.');
      return;
    }

    const s = window.getSelection().toString().trim();
    const el = s ? null : (document.querySelector('article') || document.body);
    if (!s && !el) {
      alert('Could not find content to summarize.');
      return;
    }

    const text = (s || el.innerText || '').trim();
    if (!text) {
      alert('No text content found to summarize.');
      return;
    }

    const options = { type: 'key-points', format: 'markdown' };
    const av = await Summarizer.availability(options);
    if (av === 'unavailable' || av == null) {
      alert('Summarizer unavailable: ' + av);
      return;
    }

    // ---- side panel creation / reuse ----
    const panelId = 'ai-summarizer-side-panel';
    let panel = document.getElementById(panelId);

    if (!panel) {
      panel = document.createElement('div');
      panel.id = panelId;
      panel.style.position = 'fixed';
      panel.style.top = '0';
      panel.style.right = '0';
      panel.style.width = '400px';
      panel.style.height = '100%';
      panel.style.background = 'white';
      panel.style.borderLeft = '1px solid #ccc';
      panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
      panel.style.zIndex = '2147483647';
      panel.style.display = 'flex';
      panel.style.flexDirection = 'column';
      panel.style.fontFamily = 'system-ui,-apple-system,BlinkMacSystemFont,sans-serif';

      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.padding = '8px 12px';
      header.style.borderBottom = '1px solid #eee';

      const title = document.createElement('div');
      title.textContent = 'Summary';
      title.style.fontWeight = '600';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.style.border = 'none';
      closeBtn.style.background = 'transparent';
      closeBtn.style.fontSize = '18px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.lineHeight = '1';
      closeBtn.addEventListener('click', () => {
        panel.style.display = 'none';
      });

      header.appendChild(title);
      header.appendChild(closeBtn);

      const content = document.createElement('pre');
      content.id = panelId + '-content';
      content.style.margin = '0';
      content.style.padding = '10px 12px';
      content.style.whiteSpace = 'pre-wrap';
      content.style.flex = '1';
      content.style.overflow = 'auto';
      content.style.fontFamily = 'inherit';

      panel.appendChild(header);
      panel.appendChild(content);
      document.body.appendChild(panel);
    } else {
      panel.style.display = 'flex';
    }

    const contentEl = document.getElementById(panelId + '-content');
    if (contentEl) {
      contentEl.textContent = 'Summarizing...';
    }

    // ---- summarization ----
    const summarizer = await Summarizer.create(options);
    const result = await summarizer.summarize(text);
    const output = result?.output || result || '(empty summary)';

    if (contentEl) {
      contentEl.textContent = output;
    }
  } catch (e) {
    alert('Error while summarizing: ' + e);
  }
}

