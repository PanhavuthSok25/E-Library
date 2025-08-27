<?php
$targetDir = "uploads/";
$targetFile = $targetDir . basename($_FILES["file"]["name"]);

if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
    echo "The file ". htmlspecialchars(basename($_FILES["file"]["name"])) . " has been uploaded.";
    // Save metadata to database or text file
} else {
    echo "Sorry, there was an error uploading your file.";
}
?>
