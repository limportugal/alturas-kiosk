<?php

namespace App\Services\Shared;

use Illuminate\Http\UploadedFile;

class ImageUploaderService {

     /**
     * Upload a new image.
     */
    public function upload(UploadedFile $image, string $directory): ?string {

        if(!$image) {
            return null;
        }
        $fileName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

        $image->move(public_path($directory), $fileName);

        return $directory . '/' . $fileName;
    }

    
    /**
     * Delete an image.
     */
    public function delete(?string $path): void {
        if($path && file_exists(public_path($path))) {
            unlink(public_path($path));
        }
    }


      /**
     * Replace existing image.
     */
    public function replace(
        ?UploadedFile $image,
        ?string $oldPath,
        string $folder
    ): ?string {

        if (!$image) {
            return $oldPath;
        }

        $this->delete($oldPath);

        return $this->upload($image, $folder);
    }
}