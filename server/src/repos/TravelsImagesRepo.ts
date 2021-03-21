import * as AWS from 'aws-sdk'
import {GetBucketLocationOutput} from "aws-sdk/clients/s3";
import 'source-map-support/register'
import * as AWSXRay from "aws-xray-sdk";
import {createLogger} from "../utils/logger";

// capture all data to S3
const XAWS = AWSXRay.captureAWS(AWS)

let bucketZone: string = null
/**
 * Class that implement access to S3 bucket
 */
export class TravelsImagesRepo {
    private logger = createLogger('todosImagesRepo')
    constructor(
        private readonly s3client = new XAWS.S3({
            signatureVersion: 'v4'
        }),
        private readonly travelsImagesBucket: string = process.env.TRAVELS_IMAGES_S3_BUCKET,
        private readonly urlExpiration: number = process.env.SIGNED_URL_EXPIRATION ? parseInt(process.env.SIGNED_URL_EXPIRATION, 10) : 300
    ) {
    }

    /**
     * Given a todoItem id return the image url (accessibile) for this item
     * @param travelId pk of travel
     */
    async getObjectBucketUrl(travelId: string): Promise<string>{
        if (bucketZone == null) {
            bucketZone = await this.getBucketLocation()
        }
        return `https://${this.travelsImagesBucket}.s3.${bucketZone}.amazonaws.com/${travelId}`
    }

    /**
     * Create pre-signed url for S3 bucket
     * @param travelId the pk identified the travel
     */
    getUploadUrl(travelId: string): string {
        this.logger.info('Get upload url for travelId: %s', travelId)
        return this.s3client.getSignedUrl('putObject', {
            Bucket: this.travelsImagesBucket,
            Key: travelId,
            Expires: this.urlExpiration
        })
    }

    /**
     * Return the location of bucket
     */
    async getBucketLocation(): Promise<string> {
        const bucketLocation: GetBucketLocationOutput = await this.s3client.getBucketLocation({
            Bucket: this.travelsImagesBucket
        }).promise()
        return bucketLocation.LocationConstraint
    }

    /**
     * Delete the object in the S3 bucket
     * @param travelId the pk of the travel image to delete
     */
    async deleteObjectBucket(travelId: string): Promise<void> {
        await this.s3client.deleteObject({
            Bucket: this.travelsImagesBucket,
            Key: travelId,
        }).promise()
    }
}
