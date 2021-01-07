// (() => {
//     fileReader();
//     formSubmit();
//   })();

//   function fileReader() {
//     const reader = new FileReader();
//     const fileInput = document.getElementById("fileInput");
//     const img = document.getElementById("img");

//     reader.onload = (e) => {
//       img.src = e.target.result;
//     };

//     fileInput.addEventListener("change", (e) => {
//       const f = e.target.files[0];
//       reader.readAsDataURL(f);
//     });
//   }

//   function formSubmit() {
//     const formData = document.getElementById("formData");
//     formData.addEventListener("submit", (event) => {
//       event.preventDefault();

//       const data = new FormData(formData);

//       fetch("/api/image", {
//         method: "POST",
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//         },
//         body: data,
//       }).then((res) => {
//         window.location = `/`;
//       });
//     });
//   }
$(document).ready(function () {


  // DOM Variables
  const submitBtnEl = $('#submit');
  const titleEl = $('#title');
  const descriptionEl = $('#description');
  const video_linkEl = $('#video_link');

  // functions
  async function createDesign(newDesign) {
    try {
      const result = await $.ajax({
        url: '/api/design',
        data: newDesign,
        method: 'POST',
      });

      if (result.message === 'Design added!') {
        window.location = `/edit/${result.id}`;
      } else {
        alert('Design may not have been added, please check your profile page to be sure')
      }

    } catch (err) {
      console.log(err);
    }
  }

  // click event
  submitBtnEl.on('click', (e) => {
    e.preventDefault();

    const newDesign = {
      title: titleEl.val().trim(),
      description: descriptionEl.val().trim(),
      video_link: video_linkEl.val().trim(),
    }
    createDesign(newDesign);
  })
});