function waitForIframe(selector: string) {
  return new Promise<HTMLIFrameElement>((resolve, reject) => {
    // Check if the iframe already exists
    const iframe: HTMLIFrameElement | null =
      document.querySelector<HTMLIFrameElement>(selector);
    if (iframe) {
      resolve(iframe);
      return;
    }

    // Set up a MutationObserver to watch for the iframe
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const iframe: HTMLIFrameElement | null =
            document.querySelector<HTMLIFrameElement>(selector);
          if (iframe) {
            observer.disconnect(); // Stop observing
            resolve(iframe);
            return;
          }
        }
      }
    });

    // Start observing the document body
    observer.observe(document.body, { childList: true, subtree: true });

    // Optional timeout to avoid waiting indefinitely
    setTimeout(() => {
      observer.disconnect();
      reject(
        new Error(
          `Iframe with selector "${selector}" not found within the timeout.`
        )
      );
    }, 10000); // 10-second timeout
  });
}

export { waitForIframe };