(() => {
    fileReader();
    formSubmit();
  })();
  
  function fileReader() {
    const reader = new FileReader();
    const fileInput = document.getElementById("fileInput");
    const img = document.getElementById("img");
  
    reader.onload = (e) => {
      img.src = e.target.result;
    };
  
    fileInput.addEventListener("change", (e) => {
      const f = e.target.files[0];
      reader.readAsDataURL(f);
    });
  }
  
  function formSubmit() {
    const formData = document.getElementById("formData");
    formData.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const data = new FormData(formData);
  
      fetch("/api/image", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: data,
      }).then((res) => {
        window.location = `/`;
      });
    });
  }
  