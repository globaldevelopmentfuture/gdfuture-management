import ApiServer from "@/components/system/service/ApiServer";
import PasswordResetDTO from "../dto/PasswordResetDTO";
import ApiError from "@/components/system/httpResponse/ApiError";

class PasswordService extends ApiServer {

    passwordResetRequest = async (email: string): Promise<string> => {
        const response = await this.api<null, string>(
            `/password/password-reset-request/${email}`,
            "POST",
            null
        );
        if (response.ok) {
            return await response.text();
        } else {
            const error: ApiError = await response.json();
            return Promise.reject(error);
        }
    }

    passwordReset = async (passwordResetDTO: PasswordResetDTO): Promise<string> => {
        const response = await this.api<PasswordResetDTO, string>(
            `/password/password-reset/`,
            "POST",
            passwordResetDTO
        );
        if (response.ok) {
            return await response.text();
        } else {
            const error: ApiError = await response.json();
            return Promise.reject(error);
        }
    }

    isValidateToken = async (token: string): Promise<boolean> => {
        const response = await this.api<null, boolean>(
            `/password/is-token-valid/${token}`,
            "GET",
            null
        );
        if (response.ok) {
            return await response.json();
        } else {
            const error: ApiError = await response.json();
            return Promise.reject(error);
        }
    }
}

export default PasswordService;
