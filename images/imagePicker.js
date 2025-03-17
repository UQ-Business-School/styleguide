(function(window, document) {
  // imagePicker.js module

  // Expose our module on window.imagePicker
  var imagePicker = {};

  // Helper: Create and return an element from an HTML string.
  function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  // Create a modal overlay and return it.
  function createModal() {
    var modal = document.createElement('div');
    modal.id = 'imagePickerModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    document.body.appendChild(modal);
    return modal;
  }

  // Remove the modal from the DOM.
  function closeModal(modal) {
    if(modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }

  // Our public function.
  // The callback will be called as callback(croppedImageUrl, creditMarkup)
  imagePicker.open = function(callback) {
    var modal = createModal();

    // Build base modal HTML with two tabs.
    // For now, we create a simple tab interface using two buttons.
    modal.innerHTML = `
      <div id="ipDialog" style="background: #fff; width: 80vw; height: 80vh; border-radius: 5px; padding: 20px; overflow: auto; position: relative;">
        <button id="ipCloseBtn" style="position: absolute; top: 15px; right: 15px;">X</button>
        <div id="ipTabs" style="margin-bottom: 10px;">
          <button id="ipTabLocal" style="padding:10px; color:#000;">Local Images</button>
          <button id="ipTabUnsplash" style="padding:10px; color:#000;">Unsplash</button>
        </div>
        <div id="ipContent"></div>
      </div>
    `;

    // Close button handler.
    document.getElementById('ipCloseBtn').addEventListener('click', function() {
      closeModal(modal);
    });

    // Show Local Images tab.
    function showLocalTab() {
      var content = document.getElementById('ipContent');
      content.innerHTML = `
        <div id="ipLocalView">
          <div id="ipCustomURL" style="margin-bottom: 10px;">
            <input type="text" id="ipCustomUrlInput" placeholder="Enter custom URL" style="width:70%;" />
            <button id="ipCustomUrlBtn">Select</button>
          </div>
          <div id="ipLocalGrid" style="display: flex; flex-wrap: wrap;"></div>
        </div>
      `;
      // Render local images using the external imageLibrary (assumed to be loaded).
      var localGrid = document.getElementById('ipLocalGrid');
      localGrid.innerHTML = "";
      if (typeof imageLibrary !== 'undefined' && Array.isArray(imageLibrary)) {
        // Group images by category.
        var categories = {};
        imageLibrary.forEach(function(img) {
          if(!categories[img.category]) { categories[img.category] = []; }
          categories[img.category].push(img);
        });
        for(var cat in categories) {
          var catDiv = document.createElement('div');
          catDiv.style.width = '100%';
          catDiv.innerHTML = '<h3>' + cat + '</h3>';
          categories[cat].forEach(function(img) {
            var thumb = document.createElement('img');
            thumb.src = img.url;
            thumb.alt = img.alt;
            thumb.style.width = '100px';
            thumb.style.height = 'auto';
            thumb.style.margin = '5px';
            thumb.style.cursor = 'pointer';
            thumb.addEventListener('click', function() {
              openCropTool(img.url, 'local');
            });
            catDiv.appendChild(thumb);
          });
          localGrid.appendChild(catDiv);
        }
      } else {
        localGrid.innerHTML = "No local images available.";
      }
      // Custom URL selection.
      document.getElementById('ipCustomUrlBtn').addEventListener('click', function() {
        var url = document.getElementById('ipCustomUrlInput').value;
        if(url) {
          openCropTool(url, 'custom');
        }
      });
    }

    // Show Unsplash tab.
    function showUnsplashTab() {
      var content = document.getElementById('ipContent');
      content.innerHTML = `
        <div id="ipUnsplashView">
          <div id="ipUnsplashSearch" style="margin-bottom: 10px;">
            <input type="text" id="ipUnsplashInput" placeholder="Enter search term" style="width:70%;" />
            <button id="ipUnsplashBtn">Search</button>
          </div>
          <div id="ipUnsplashGrid" style="display: flex; flex-wrap: wrap;"></div>
        </div>
      `;
      document.getElementById('ipUnsplashBtn').addEventListener('click', function() {
        var term = document.getElementById('ipUnsplashInput').value;
        if(term) { searchUnsplash(term); }
      });
    }

    // Attach tab click events.
    document.getElementById('ipTabLocal').addEventListener('click', function() {
      showLocalTab();
    });
    document.getElementById('ipTabUnsplash').addEventListener('click', function() {
      showUnsplashTab();
    });

    // Show local tab by default.
    showLocalTab();

    // Unsplash integration.
    var UNSPLASH_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // replace with your 43-character key
    function searchUnsplash(query) {
      var grid = document.getElementById('ipUnsplashGrid');
      grid.innerHTML = "Loading...";
      var url = "https://api.unsplash.com/search/photos?client_id=" + UNSPLASH_ACCESS_KEY +
                "&query=" + encodeURIComponent(query) + "&orientation=landscape";
      fetch(url)
        .then(function(response){ return response.json(); })
        .then(function(data) {
          grid.innerHTML = "";
          if(data.results && data.results.length > 0) {
            data.results.forEach(function(result) {
              var thumb = document.createElement('img');
              thumb.src = result.urls.thumb;
              thumb.alt = result.alt_description || "";
              thumb.style.width = '100px';
              thumb.style.height = 'auto';
              thumb.style.margin = '5px';
              thumb.style.cursor = 'pointer';
              thumb.addEventListener('click', function() {
                openCropTool(result.urls.regular, 'unsplash', result.user);
              });
              grid.appendChild(thumb);
            });
          } else {
            grid.innerHTML = "No results found.";
          }
        })
        .catch(function(err) {
          grid.innerHTML = "Error fetching Unsplash images.";
          console.error(err);
        });
    }

    // Crop tool.
    function openCropTool(imageUrl, source, user) {
      // Replace modal content with cropping UI.
      modal.innerHTML = `
        <div id="ipDialog" style="background: #fff; width: 80vw; height: 80vh; border-radius: 5px; padding: 20px; overflow: hidden; position: relative;">
          <button id="ipCropCloseBtn" style="position: absolute; top: 15px; right: 15px;">X</button>
          <h2>Crop Image</h2>
          <div id="ipCropContainer" style="position: relative; max-width: 100%; max-height: calc(80vh - 100px); overflow: hidden; margin-bottom: 10px;">
            <img id="ipCropImage" src="${imageUrl}" style="max-width:100%; max-height:100%; user-select:none; -webkit-user-drag:none;" crossorigin="anonymous">
            <div id="ipCropBox" style="position: absolute; left:0; top:0; width:100%; height:100%; border: 2px dashed #51247a;"></div>
          </div>
          <button id="ipCropBtn">Crop</button>
          <button id="ipCropCancelBtn">Cancel</button>
        </div>
      `;
      // Close button.
      document.getElementById('ipCropCloseBtn').addEventListener('click', function() {
         closeModal(modal);
      });
      // Cancel returns to the previous view.
      document.getElementById('ipCropCancelBtn').addEventListener('click', function() {
         // For simplicity, return to local view; you can adjust based on source.
         if(source === 'unsplash') {
           showUnsplashTab();
         } else {
           showLocalTab();
         }
      });
      initCropTool(source, user, callback, modal);
    }

    // Initialize cropping functionality.
    function initCropTool(source, user, callback, modal) {
      var cropBox = document.getElementById('ipCropBox');
      var cropImage = document.getElementById('ipCropImage');
      // When the image loads, set crop box dimensions to match the image.
      cropImage.onload = function() {
        cropBox.style.left = "0px";
        cropBox.style.top = "0px";
        cropBox.style.width = cropImage.clientWidth + "px";
        cropBox.style.height = cropImage.clientHeight + "px";
      };
      // Simple dragging of cropBox.
      var isDragging = false, startX, startY, startLeft, startTop;
      cropBox.addEventListener('mousedown', function(e) {
         // Start dragging if the user clicks inside the crop box.
         isDragging = true;
         startX = e.clientX;
         startY = e.clientY;
         startLeft = parseInt(cropBox.style.left);
         startTop = parseInt(cropBox.style.top);
         e.preventDefault();
      });
      document.addEventListener('mousemove', function(e) {
         if(!isDragging) return;
         var dx = e.clientX - startX;
         var dy = e.clientY - startY;
         var newLeft = startLeft + dx;
         var newTop = startTop + dy;
         // Clamp so the crop box stays within the image.
         newLeft = Math.max(0, Math.min(newLeft, cropImage.clientWidth - parseInt(cropBox.style.width)));
         newTop = Math.max(0, Math.min(newTop, cropImage.clientHeight - parseInt(cropBox.style.height)));
         cropBox.style.left = newLeft + "px";
         cropBox.style.top = newTop + "px";
      });
      document.addEventListener('mouseup', function(e) {
         isDragging = false;
      });
      // Crop button handler.
      document.getElementById('ipCropBtn').addEventListener('click', function() {
         var imgRect = cropImage.getBoundingClientRect();
         var boxRect = cropBox.getBoundingClientRect();
         var scaleX = cropImage.naturalWidth / cropImage.clientWidth;
         var scaleY = cropImage.naturalHeight / cropImage.clientHeight;
         var cropX = (boxRect.left - imgRect.left) * scaleX;
         var cropY = (boxRect.top - imgRect.top) * scaleY;
         var cropWidth = boxRect.width * scaleX;
         var cropHeight = boxRect.height * scaleY;
         var canvas = document.createElement('canvas');
         canvas.width = cropWidth;
         canvas.height = cropHeight;
         var ctx = canvas.getContext('2d');
         ctx.drawImage(cropImage, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
         var dataUrl = canvas.toDataURL();
         var credit = "";
         if(source === 'unsplash' && user) {
           credit = `Photo credit: <a href="${user.links.html}" target="_blank">${user.name}</a> on <a href="https://unsplash.com" target="_blank">Unsplash</a>`;
         }
         callback(dataUrl, credit);
         closeModal(modal);
      });
    }

  };

  // Expose imagePicker globally.
  window.imagePicker = imagePicker;
})(window, document);
