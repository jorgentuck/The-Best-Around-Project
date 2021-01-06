$(document).ready(function() {
    const faceIcon = $("#menu");
    const alertIcon = $("#alerts");
    const profDropdown = $("#prof-dropdown");
    const alertDrop = $("#alert-dropdown");

    faceIcon.on('click', () => {
      if (profDropdown.attr("data-id") === "0") {
        profDropdown.attr({
          "data-id": "1",
          "class": "transition ease-out duration-100 transform opacity-100 scale-100 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5",
          "style": "visibility: visible"
        })
      } else if (profDropdown.attr("data-id") === "1") {
        profDropdown.attr({
          "data-id": "0",
          "class": "transition ease-in duration-75 transform opacity-0 scale-95 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5",
          "style": "visibility: hidden"
        })
      }
    });

    alertIcon.on('click', () => {
      if (alertDrop.attr("data-id") === "0") {
        alertDrop.attr({
          "data-id": "1",
          "class": "transition ease-out duration-100 transform opacity-100 scale-100 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5",
          "style": "visibility: visible"
        })
      } else if (alertDrop.attr("data-id") === "1") {
        alertDrop.attr({
          "data-id": "0",
          "class": "transition ease-in duration-75 transform opacity-0 scale-95 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5",
          "style": "visibility: hidden"
        })
      }
    });
});