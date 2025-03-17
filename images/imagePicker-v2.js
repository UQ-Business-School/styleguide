(function(window, document) {
  var imagePicker = {};

  // Utility: Create element from an HTML string.
  function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  // Create modal overlay and append to document.body.
  function createModal() {
    var modal = document.createElement('div');
    modal.id = 'ipModal';
    modal.className = 'ip-modal';
    document.body.appendChild(modal);
    return modal;
  }

  // Remove modal from DOM.
  function closeModal(modal) {
    if(modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }

  // Public function: Opens the image picker.
  // callback(imageUrl, creditMarkup) will be called when an image is selected.
  imagePicker.open = function(callback) {
    var modal = createModal();

    // Build modal HTML with tabs for local and Unsplash.
    modal.innerHTML = `
      <div class="ip-dialog">
        <button class="ip-close-btn">X</button>
        <div class="ip-tabs">
          <button class="ip-tab ip-tab-local active" data-tab="local">Local Images</button>
          <button class="ip-tab ip-tab-unsplash" data-tab="unsplash">Unsplash</button>
        </div>
        <div class="ip-content"></div>
      </div>
    `;

    var dialog = modal.querySelector('.ip-dialog');
    var contentDiv = modal.querySelector('.ip-content');
    var closeBtn = modal.querySelector('.ip-close-btn');
    closeBtn.addEventListener('click', function() { closeModal(modal); });

    // Tab switch event listeners.
    var localTabBtn = modal.querySelector('.ip-tab-local');
    var unsplashTabBtn = modal.querySelector('.ip-tab-unsplash');

    localTabBtn.addEventListener('click', function() {
      localTabBtn.classList.add('active');
      unsplashTabBtn.classList.remove('active');
      showLocalImages(contentDiv);
    });
    unsplashTabBtn.addEventListener('click', function() {
      unsplashTabBtn.classList.add('active');
      localTabBtn.classList.remove('active');
      showUnsplashImages(contentDiv);
    });

    // Initially show local images.
    showLocalImages(contentDiv);

    // -- Local Images Tab --
    function showLocalImages(container) {
      container.innerHTML = `
        <div class="ip-custom-url">
          <input type="text" id="ipCustomUrlInput" placeholder="Enter custom URL" />
          <button id="ipCustomUrlBtn">Select</button>
        </div>
        <div class="ip-local-grid"></div>
      `;
      var customUrlBtn = container.querySelector('#ipCustomUrlBtn');
      customUrlBtn.addEventListener('click', function() {
        var url = container.querySelector('#ipCustomUrlInput').value;
        if(url) { openCropTool(url, 'local'); }
      });
      var localGrid = container.querySelector('.ip-local-grid');
      localGrid.innerHTML = "";
      if (window.imageLibrary && Array.isArray(window.imageLibrary)) {
        // Group images by category.
        var categories = {};
        window.imageLibrary.forEach(function(img) {
          if(!categories[img.category]) { categories[img.category] = []; }
          categories[img.category].push(img);
        });
        for(var cat in categories) {
          var catDiv = document.createElement('div');
          catDiv.className = 'ip-category';
          catDiv.innerHTML = '<h3>' + cat + '</h3>';
          categories[cat].forEach(function(img) {
            var thumb = document.createElement('img');
            thumb.src = img.url;
            thumb.alt = img.alt;
            thumb.className = 'ip-thumb';
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
    }

    // -- Unsplash Tab --
    function showUnsplashImages(container) {
      container.innerHTML = `
        <div class="ip-unsplash-search">
          <input type="text" id="ipUnsplashInput" placeholder="Search Unsplash" />
          <button id="ipUnsplashSearchBtn">Search</button>
        </div>
        <div class="ip-unsplash-grid"></div>
      `;
      var searchBtn = container.querySelector('#ipUnsplashSearchBtn');
      searchBtn.addEventListener('click', function() {
        var term = container.querySelector('#ipUnsplashInput').value;
        if(term) { searchUnsplash(term, container.querySelector('.ip-unsplash-grid')); }
      });
    }

    // Unsplash search function.
    function searchUnsplash(query, gridContainer) {
      gridContainer.innerHTML = "Loading...";
      var accessKey = "c5O1Qwh_6wwO57xx5T1bVtOS12mTZCuOfsGLMoE4S6M"; // Replace with your actual 43-char key.
      var url = "https://api.unsplash.com/search/photos?client_id=" + accessKey +
                "&query=" + encodeURIComponent(query) + "&orientation=landscape";
      fetch(url)
        .then(function(response){ return response.json(); })
        .then(function(data) {
          gridContainer.innerHTML = "";
          if(data.results && data.results.length > 0) {
            data.results.forEach(function(result) {
              var thumb = document.createElement('img');
              thumb.src = result.urls.thumb;
              thumb.alt = result.alt_description || "";
              thumb.className = 'ip-thumb';
              thumb.addEventListener('click', function() {
                openCropTool(result.urls.regular, 'unsplash', result.user);
              });
              gridContainer.appendChild(thumb);
            });
          } else {
            gridContainer.innerHTML = "No results found.";
          }
        })
        .catch(function(err) {
          gridContainer.innerHTML = "Error fetching Unsplash images.";
          console.error(err);
        });
    }

    // -- Cropping Tool --
    // Displays cropping UI and initializes drag/resize.
    function openCropTool(imageUrl, source, user) {
      // Replace modal content with cropping UI.
      modal.innerHTML = `
        <div class="ip-dialog ip-crop-dialog">
          <button class="ip-close-btn">X</button>
          <h2>Crop Image</h2>
          <div class="ip-crop-container">
            <img id="ipCropImage" src="${imageUrl}" crossorigin="anonymous">
            <div id="ipCropBox">
              <div class="ip-resize-handle ip-handle-tl"></div>
              <div class="ip-resize-handle ip-handle-tr"></div>
              <div class="ip-resize-handle ip-handle-bl"></div>
              <div class="ip-resize-handle ip-handle-br"></div>
            </div>
          </div>
          <button id="ipCropBtn">Crop</button>
          <button id="ipCropCancelBtn">Cancel</button>
        </div>
      `;
      // Close and cancel handlers.
      modal.querySelector('.ip-close-btn').addEventListener('click', function() {
        closeModal(modal);
      });
      modal.querySelector('#ipCropCancelBtn').addEventListener('click', function() {
        // Return to the previous image selection view.
        if(source === 'unsplash') {
          // Show Unsplash tab again.
          modal.innerHTML = ""; // Reset modal.
          // Re-create the modal dialog with tabs.
          modal = createModal();
          modal.innerHTML = `
            <div class="ip-dialog">
              <button class="ip-close-btn">X</button>
              <div class="ip-tabs">
                <button class="ip-tab ip-tab-local" data-tab="local">Local Images</button>
                <button class="ip-tab ip-tab-unsplash active" data-tab="unsplash">Unsplash</button>
              </div>
              <div class="ip-content"></div>
            </div>
          `;
          modal.querySelector('.ip-close-btn').addEventListener('click', function() { closeModal(modal); });
          showUnsplashImages(modal.querySelector('.ip-content'));
        } else {
          // For local or custom, return to local view.
          modal.innerHTML = ""; // Reset modal.
          modal = createModal();
          modal.innerHTML = `
            <div class="ip-dialog">
              <button class="ip-close-btn">X</button>
              <div class="ip-tabs">
                <button class="ip-tab ip-tab-local active" data-tab="local">Local Images</button>
                <button class="ip-tab ip-tab-unsplash" data-tab="unsplash">Unsplash</button>
              </div>
              <div class="ip-content"></div>
            </div>
          `;
          modal.querySelector('.ip-close-btn').addEventListener('click', function() { closeModal(modal); });
          showLocalImages(modal.querySelector('.ip-content'));
        }
      });
      
      initCropTool(source, user, callback, modal);
    }

    // Initialize crop tool: dragging and resizing crop box.
    function initCropTool(source, user, callback, modal) {
      var cropBox = document.getElementById('ipCropBox');
      var cropImage = document.getElementById('ipCropImage');
      // When image loads, set cropBox to cover full image.
      cropImage.onload = function() {
        cropBox.style.left = "0px";
        cropBox.style.top = "0px";
        cropBox.style.width = cropImage.clientWidth + "px";
        cropBox.style.height = cropImage.clientHeight + "px";
      };

      // Enable dragging of crop box.
      var isDragging = false, startX, startY, startLeft, startTop;
      cropBox.addEventListener('mousedown', function(e) {
        if(e.target.classList.contains('ip-resize-handle')) return;
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
        newLeft = Math.max(0, Math.min(newLeft, cropImage.clientWidth - parseInt(cropBox.style.width)));
        newTop = Math.max(0, Math.min(newTop, cropImage.clientHeight - parseInt(cropBox.style.height)));
        cropBox.style.left = newLeft + "px";
        cropBox.style.top = newTop + "px";
      });
      document.addEventListener('mouseup', function() { isDragging = false; });
      
      // Enable resizing via corner handles.
      var isResizing = false, currentHandle, startWidth, startHeight;
      var handles = cropBox.querySelectorAll('.ip-resize-handle');
      handles.forEach(function(handle) {
        handle.addEventListener('mousedown', function(e) {
          e.stopPropagation();
          isResizing = true;
          currentHandle = handle;
          startX = e.clientX;
          startY = e.clientY;
          var style = window.getComputedStyle(cropBox);
          startWidth = parseInt(style.width);
          startHeight = parseInt(style.height);
          startLeft = parseInt(style.left);
          startTop = parseInt(style.top);
          document.addEventListener('mousemove', resizeCropBox);
          document.addEventListener('mouseup', stopResize);
        });
      });
      function resizeCropBox(e) {
        if(!isResizing) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        var newLeft = startLeft, newTop = startTop, newWidth = startWidth, newHeight = startHeight;
        if(currentHandle.classList.contains('ip-handle-br')) {
          newWidth = startWidth + dx;
          newHeight = startHeight + dy;
        } else if(currentHandle.classList.contains('ip-handle-tr')) {
          newWidth = startWidth + dx;
          newTop = startTop + dy;
          newHeight = startHeight - dy;
        } else if(currentHandle.classList.contains('ip-handle-bl')) {
          newLeft = startLeft + dx;
          newWidth = startWidth - dx;
          newHeight = startHeight + dy;
        } else if(currentHandle.classList.contains('ip-handle-tl')) {
          newLeft = startLeft + dx;
          newTop = startTop + dy;
          newWidth = startWidth - dx;
          newHeight = startHeight - dy;
        }
        newLeft = Math.max(0, newLeft);
        newTop = Math.max(0, newTop);
        if(newLeft + newWidth > cropImage.clientWidth) {
          newWidth = cropImage.clientWidth - newLeft;
        }
        if(newTop + newHeight > cropImage.clientHeight) {
          newHeight = cropImage.clientHeight - newTop;
        }
        newWidth = Math.max(20, newWidth);
        newHeight = Math.max(20, newHeight);
        cropBox.style.left = newLeft + "px";
        cropBox.style.top = newTop + "px";
        cropBox.style.width = newWidth + "px";
        cropBox.style.height = newHeight + "px";
      }
      function stopResize(e) {
        isResizing = false;
        document.removeEventListener('mousemove', resizeCropBox);
        document.removeEventListener('mouseup', stopResize);
      }
      
      // Crop button: perform the crop and return the result.
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
        if(croppingSource === 'unsplash' && user) {
          credit = `Photo credit: <a href="${user.links.html}" target="_blank">${user.name}</a> on <a href="https://unsplash.com" target="_blank">Unsplash</a>`;
        }
        callback(dataUrl, credit);
        closeModal(modal);
      });
    }
    /* ----------------- End Cropping Tool ----------------- */
  };

  window.imagePicker = imagePicker;
})(window, document);
