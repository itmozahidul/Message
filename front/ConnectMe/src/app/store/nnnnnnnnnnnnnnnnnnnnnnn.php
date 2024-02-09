<!DOCTYPE html>
<html>
  <head>
    <title>Bootstrap Example</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
  </head>
  <body>
    <div class="container">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <h4>Select image to upload:</h4>
      </div>
      <div class="col mb-3">
        <div class="card">
          <div class="card-body">
            <div class="e-profile">
              <div class="row">
                <div class="col-md-4">
                  <form
                    action="upload.php"
                    method="post"
                    enctype="multipart/form-data"
                  >
                    <div class="mb-5">
                      <div class="p-4" style="background-color: #f8f9fa">
                        <input
                          type="file"
                          name="fileToUpload"
                          id="fileToUpload"
                        />
                      </div>
                    </div>
                    <div class="mb-5">
                      <div class="p-4" style="background-color: #f8f9fa">
                        <input
                          type="submit"
                          value="Upload"
                          name="submit"
                          class="btn btn-lg btn-primary"
                        />
                      </div>
                    </div>
                  </form>
                </div>
                <div class="row">
                  <div class="mb-5">
                    <div class="p-4" style="background-color: #f8f9fa">
                      <?php
                      $d = dir(getcwd()).'/uploads/';

echo "Handle: " . $d->handle . "<br />"; echo "Path: " . $d->path . "<br />";
                      while (($file = $d->read()) !== false){ echo "filename: "
                      . $file . "<br />"; } $d->close(); ?>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="row d-flex justify-content-center align-items-center h-100"
      ></div>
    </div>
  </body>
</html>
