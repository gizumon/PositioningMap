// import * as _ from 'lodash';

/**
 * Applications
 */
export interface IApp {
    user?: IUser,
    projects?: IProject[],
    shared_projects?: ISharedProject[],
    attributes?: IAttribute[]
}
/**
 * Users table
 */
export interface IUser {
    id?: string,
    auth_id?: string,
    name?: string
}
/**
 * Projects table
 * @FK label_id:Labels.id, created_user_id:User.id
 */
export interface IProject {
    id?: string,
    name: string,
    description?: string,
    image?: string,
    label: ILabel,
    plots?: IPlot[],
    created_user_id: string,
    // for shared project
    authority?: 0 | 1 | 2
}
/**
 * Labels table
 */
export interface ILabel {
    id?: string,
    x: [string, string],
    y: [string, string],
    z?: [string, string]
}
/**
 * Plots table
 * @FK create_user_id:Users.id, coordinate_id:Coordinate.id, project_id:Projects.id
 */
export interface IPlot {
    id?: string,
    name: string,
    coordinate: {
        x: number,
        y: number,
        z?: number
    },
    belongs?: IBelong[],
    created_user_id: string,
    project_id?: string
}
/**
 * Belongs table
 * @FK plot_id:Plot.id, attribute_id:Attribute.id
 */
export interface IBelong {
    id?: string,
    plot_id?: string,
    attribute: IAttribute,
    is_checked: boolean
}
/**
 * Attributes table
 */
export interface IAttribute {
    id?: string,
    name: string,
    arguments?: any[]
}
/**
 * SharedProjects table
 * @FK user_id:Users.id, project_id:Projects.id
 */
export interface ISharedProject {
    id?: string,
    user: IUser,
    project?: IProject,
    authority: 0 | 1 | 2
}

/**
 * JSON template definition
 */
export class Template {
    // constructor() { };
    /**
     * Entire app JSON
     * @return { user, settings[], projects[] }
     */
    static app():IApp {
        return {
            user: this.user(),
            projects: [this.project()],
            shared_projects: [this.shared_projects()],
            attributes: [this.attribute()]
        };
    };

    /**
     * Project setting information
     * @return { id, name }
     */
    static user():IUser {
        return {
            id: 'default',
            name: 'NoUser'
        }
    }

    /**
     * Project setting information
     * @return { id, name, label{}, attributes[], plots[] }
     */
    static project():IProject {
        return {
            id: 'default',
            name: 'New Project',
            image: '',
            description: 'This is new project. You can write description here.',
            label: {
                x: ['-x-label', '+x-label'],
                y: ['-y-label', '+y-label'],
                z: ['-z-label', '+z-label']
            },
            plots: [this.plot()],
            created_user_id: this.user().id
        };
    };

    /**
     * Attribute settings attaching to plots
     * @return { id, name, configs[] }
     */
    static attribute():IAttribute {
        return {
            id: 'default',
            name: 'New Attribute',
            arguments: ['']
        };
    };

    /**
     * Plot information
     * @return { id, name, coordinate{}, belongs[] }
     */
    static plot():IPlot {
        return {
            id: '',
            name: 'New Plot',
            coordinate: {
                x: 0,
                y: 0,
                z: 0
            },
            belongs: [this.belong()],
            created_user_id: this.user().id
        };
    };

    /**
     * Attributes belonged by plot
     * @return {attribute_id, is_checked}
     */
    static belong():IBelong {
        return {
            attribute: this.attribute(),
            is_checked: false,
        };
    };

    static shared_projects():ISharedProject {
        return {
            user: this.user(),
            project: this.project(),
            authority: 2
        }
    }

    static sample():IApp {
        return {
            user: this.user(),
            projects: [{
                id: 'prj1',
                name: '犬',
                created_user_id: this.user().id,
                description: '犬をかわいい、かっこいいマッピングする',
                image: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
                label: {
                    x: ['かわいい', 'かっこいい'],
                    y: ['小さい', '大きい']
                },
                plots: [{
                    id: 'plt1',
                    name: 'チワワ',
                    created_user_id: this.user().id,
                    coordinate: {
                        x: -50,
                        y: -50
                    },
                    belongs: [{
                        attribute: {
                            name: 'attr1',
                            arguments: []
                        },
                        is_checked: false
                    }]
                },{
                    id: 'plt2',
                    name: 'ダックスフンド',
                    created_user_id: this.user().id,
                    coordinate: {
                        x: 50,
                        y: -50
                    },
                    belongs: [{
                        attribute: {
                            name: 'attr1',
                            arguments: []
                        },
                        is_checked: false
                    }]
                },{
                    id: 'plt3',
                    name: 'シェパード',
                    created_user_id: this.user().id,
                    coordinate: {
                        x: 50,
                        y: 50
                    },
                    belongs: [{
                        attribute: {
                            name: 'attr1',
                            arguments: []
                        },
                        is_checked: false
                    }]
                },{
                    id: 'plt4',
                    name: 'ラブラドール',
                    created_user_id: this.user().id,
                    coordinate: {
                        x: -50,
                        y: 50
                    },
                    belongs: [{
                        attribute: {
                            name: "attr1",
                        },
                        is_checked: false
                    }]
                },{
                    id: 'plt5',
                    name: 'パピヨン',
                    created_user_id: this.user().id,
                    coordinate: {
                        x: 67,
                        y: -40
                    },
                    belongs: [{
                        attribute: {
                            name: 'attr1',
                            arguments: []
                        },
                        is_checked: false
                    }]
                },{
                    id: 'origin',
                    name: '柴犬',
                    created_user_id: this.user().id,
                    coordinate: {
                        x: 0,
                        y: 0
                    }
                }],
            }, {
                id: 'prj2',
                name: 'dummy2',
                description: 'This is description for dummy',
                created_user_id: this.user().id,
                label: {
                    x: ['-x-label', '+x-label'],
                    y: ['-y-label', '+y-label']
                },
                plots: [{
                    id: 'plt1',
                    name: 'plot1',
                    created_user_id: this.user().id,
                    coordinate: {
                        x: 1,
                        y: 1
                    },
                    belongs: [{
                        attribute: {
                            name: 'attr1',
                            arguments: []
                        },
                        is_checked: false
                    }]
                }]
            }],
            shared_projects: [{
                user: this.user(),
                project: this.project(),
                authority: 2
            }],
            attributes: [{
                id: 'attr',
                name: '色変更',
                arguments: ['#ff0000', '#0000ff']
            }]
        };
    };
}
