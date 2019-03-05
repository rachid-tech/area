import sequelize from '../utils/database';
import * as Sequelize from 'sequelize';
import User from './User';
import { projectType, userType } from './modelsType';
import { githubProviderType } from './github/githubTypes';

const Project: any = sequelize.define('Project', {
	name: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	description: {
		type: Sequelize.STRING,
		allowNull: false
	},
	imageUrl: {
		type: Sequelize.STRING,
		allowNull: true
	}
});

Project.afterCreate(async (project: projectType) => {
	const user: userType = await User.findByPk(project.userId);
	// const trelloProvider = await user.getTrelloProvider();
	const githubProvider: githubProviderType = await user.getGithubProvider();
	// await trelloProvider.createNewBoard(project);
	await githubProvider.createRepo(project);
	return project;
});

export default Project;
