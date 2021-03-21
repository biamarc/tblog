import {TravelsImagesRepo} from "../repos/TravelsImagesRepo";

const repo = new TravelsImagesRepo()

/**
 * Return pre-signed url to utilize uploading
 * @param travelId the travel identifier
 */
export function getUploadSignedUrl(travelId: string): string{
    return repo.getUploadUrl(travelId)
}

/**
 * Return the url used to download an image attached to travel
 * @param travelId the pk of travel
 */
export async function getDownloadImageUrl(travelId: string): Promise<string>{
    return repo.getObjectBucketUrl(travelId)
}

/**
 * Delete image associated to travel
 * @param travelId the pk of todoItem
 */
export async function removeImage(travelId: string): Promise<void>{
    return repo.deleteObjectBucket(travelId)
}
