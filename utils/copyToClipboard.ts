// Supposed to be new method, although not working in safari
export async function copyToClipboardV2(str: string): Promise<void> {
  if (!navigator.clipboard) {
    return Promise.reject("Clipboard not supported!");
  }

  try {
    await navigator.clipboard.writeText(str);
    return Promise.resolve();
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

// Legacy method, but works in all browsers
export async function copyToClipboard(str: string): Promise<void> {
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  document.body.appendChild(el);

  try {
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      // save current contentEditable/readOnly status
      var editable = el.contentEditable;
      var readOnly = el.readOnly;

      // convert to editable with readonly to stop iOS keyboard opening
      // el.contentEditable = true;
      el.readOnly = true;

      // create a selectable range
      var range = document.createRange();
      range.selectNodeContents(el);

      // select the range
      var selection = window.getSelection();
      selection!.removeAllRanges();
      selection!.addRange(range);
      el.setSelectionRange(0, 999999);

      // restore contentEditable/readOnly to original state
      el.contentEditable = editable;
      el.readOnly = readOnly;
    } else {
      el.select();
    }
    document.execCommand("copy");
    document.body.removeChild(el);

    return Promise.resolve();
  } catch (error) {
    console.log(error);
    document.body.removeChild(el);
    return Promise.reject(error);
  }
}
export default copyToClipboard;
