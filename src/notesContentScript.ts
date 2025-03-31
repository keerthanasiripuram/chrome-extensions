window.addEventListener('mouseup', () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      console.log('Selected Text:', selection);
    }
  });