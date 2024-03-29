import { createC2pa, createL2ManifestStore, generateVerifyUrl } from 'c2pa';
import wasmSrc from 'c2pa/dist/assets/wasm/toolkit_bg.wasm?url';
import workerSrc from 'c2pa/dist/c2pa.worker.js?url';
import 'c2pa-wc';

(async () => {
  const c2pa = await createC2pa({
    wasmSrc,
    workerSrc,
  });

  try {
    const image = document.querySelector('img');

    if (!image) {
      return;
    }

    const { manifestStore } = await c2pa.read(image);

    if (!manifestStore) {
      return;
    }

    const { manifestStore: l2ManifestStore } = await createL2ManifestStore(
      manifestStore,
    );

    const manifestSummary = document.querySelector(
      'cai-manifest-summary',
    ) as any;

    manifestSummary.manifestStore = l2ManifestStore;
    manifestSummary.viewMoreUrl = generateVerifyUrl(image.src);
    function isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }
    
    if (isIOS()) {
      manifestSummary.manifestStore = l2ManifestStore;
    } 
  } catch (err) {
    console.error('Error reading image:', err);
  }

  const iconElement = document.querySelector('cai-popover');
    if (iconElement) {
      iconElement.addEventListener('mouseover', () => {
        console.log('cai-icon-info element hovered');
      });
    } else {
      console.error('cai-icon-info element not found');
    }

})();
