import { bucketCreate } from '../../../src/main/gcp/bucket';
import {store} from "../../../src/main/local/store";

test('Check bucket create', () => {
    process.env['FAKE_GCP_SERVER_ENDPOINT'] = 'https://0.0.0.0:4443/';
    store.set('SERVICE_ACCOUNT', '{\n' +
        '  "type": "service_account",\n' +
        '  "project_id": "stashbox-123456",\n' +
        '  "client_email": "stashbox-service-account@stashbox-123456.iam.gserviceaccount.com",\n' +
        '  "universe_domain": "googleapis.com"\n' +
        '}');
    const data = { locationType: 'region', location: 'us-central1', classType: 'standard' };
    expect(bucketCreate(data)).resolves.toBeUndefined();
});