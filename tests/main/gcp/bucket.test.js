import { describe, it, expect, vi } from 'vitest';
import { gcpBucket } from '../../../src/main/gcp/bucket';

vi.mock('electron-store', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            get: vi.fn(() => {
                return JSON.stringify({
                    project_id: 'test-project',
                    client_email: 'test-email@email.it',
                    type: "service_account",
                    private_key_id: "123",
                    private_key: "",
                });
            }),
            set: vi.fn(),
            delete: vi.fn(),
            clear: vi.fn(),
        })),
    };
});
describe('gcpBucket', () => {

    afterAll(() => {
        vi.restoreAllMocks()
    });


    it('exists: should return false, bucket not exists', async () => {
        const exists = await gcpBucket.bucket_exists();
        expect(exists).toBe(false);
    });

    it('exists: should return true, bucket is created', async () => {
        await gcpBucket.bucket_create({
            location: 'europe-west8',
            classType: 'standard'
        });
        const exists = await gcpBucket.bucket_exists();
        expect(exists).toBe(true);
    });
});