console.log("load autofill extention");
const autofillFname = 'Yuli';
const autofillLname = 'Stremovsky';
const autofillEmail = 'stremovsky@gmail.com';
const autofillTel = '+972-524486622';
const autofillLinkedin = 'https://www.linkedin.com/in/stremovsky/';

const autofillDict = {
  'fname': autofillFname,
  'firstname': autofillFname,
  'first-name': autofillFname,
  'first_name': autofillFname,
  'lname': autofillLname,
  'lastname': autofillLname,
  'last-name': autofillLname,
  'last_name': autofillLname,
  'fname': autofillLname,
  'familyname': autofillLname,
  'family-name': autofillLname,
  'family_name': autofillLname,
  'tel': autofillTel,
  'phone': autofillTel,
  'email': autofillEmail,
  'linkedin': autofillLinkedin
};

function autofillFixInputFields(doc) {
  if (!doc) {
    return false;
  }
  let inputs = doc.getElementsByTagName('input');
  for (let input of inputs) {
    if (input.type && input.type == "file") {
      continue;
    }
    console.log(input.id, input.name, input.type, input.autocomplete, input.outerHTML);
    for(var key in autofillDict) {
      if (input.id == key || input.type == key || 
          input.name.toLowerCase().includes(key) || 
          input.autocomplete.toLowerCase().includes(key) ||
          (""+input.outerHTML).toLowerCase().includes(key)) {
        input.value = autofillDict[key];;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }
  return false;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "autofill") {
      autofillFixInputFields(document);
      let iframes = document.getElementsByTagName('iframe');
      for (let iframe of iframes) {
        try {
          autofillFixInputFields(iframe.contentDocument);
        } catch (e) {
          console.log('Cannot access iframe:', e);
        }
      }
      sendResponse({status: "completed"});
    }
  }
);
