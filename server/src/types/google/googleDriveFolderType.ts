import googleDriveFileType from './googleDriveFileType';
import projectType from 'projectType';

export default interface googleDriveFolderType {
	id: string;
	name: string;
	accessToken: string;
	fetchFiles?: (googleToken: string) => any;
	getProject?: () => projectType;
	getGoogleDriveFiles?: (options?: any) => Array<googleDriveFileType>;
	destroy?: () => any;
}
