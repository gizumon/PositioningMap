// import * as _ from 'lodash';

export interface IApp {
    user: IUser,
    projects: IProject[],
    shared_projects: ISharedProjects[]
}
export interface IUser {
    id: String,
    name: String
}
export interface IProject {
    id: String,
    name: String,
    description: String,
    image?: String,
    label: ILabel,
    attributes: IAttribute[],
    plots: IPlot[]
}
export interface ILabel {
    x: [String, String],
    y: [String, String],
    z?: [String, String]
}
export interface IAttribute {
    id: String,
    name: String,
    configs?: IConfig[]
}
export interface IConfig {
    id: String,
    name: String,
    arguments?: any[]
}
export interface IPlot {
    id: String,
    name: String,
    created_user_id: String,
    coordinate: {
        x: Number,
        y: Number,
        z?: Number
    },
    belongs?: IBelong[]
}
export interface IBelong {
    attribute_id: String,
    isChecked: Boolean
}

export interface ISharedProjects {
    shared_user_id: String,
    project_id: String,
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
            user: {
                id: 'default',
                name: 'NoUser'
            },
            // settings: [this.setting()],
            projects: [this.project()],
            shared_projects: [this.shared_projects()]
        };
    };

    /**
     * User setting information
     * @return { id, name, isChecked }
     */
    // setting() {
    //     return {
    //         id: '',
    //         name: '',
    //         isChecked: false
    //     };
    // };

    /**
     * Project setting information
     * @return { id, name, label{}, attributes[], plots[] }
     */
    static project():IProject {
        return {
            id: 'default',
            name: 'New Project',
            description: 'This is new project. You can write description here.',
            label: {
                x: ['-x-label', '+x-label'],
                y: ['-y-label', '+y-label'],
                z: ['-z-label', '+z-label']
            },
            attributes: [this.attribute()],
            plots: [this.plot()]
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
            configs: [this.config()]
        };
    };

    /**
     * Configure settings operating plots
     * @return { id, name, arguments[]}
     */
    static config():IConfig {
        return {
            id: 'default',
            name: 'New configuration',
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
            created_user_id: '', 
            name: 'New Plot',
            coordinate: {
                x: 0,
                y: 0,
                z: 0
            },
            belongs: [this.belong()]
        };
    };

    /**
     * Attributes belonged by plot
     * @return {attribute_id, isChecked}
     */
    static belong():IBelong {
        return {
            attribute_id: 'default',
            isChecked: false
        };
    };

    static shared_projects():ISharedProjects {
        return {
            shared_user_id: 'guest',
            project_id: 'shared_sample',
            authority: 2
        }
    }

    static sample():IApp {
        return {
            user: {
                id: 'anonymous',
                name: 'guest'
            },
            projects: [{
                id: 'prj1',
                name: 'dummy',
                description: 'This is description for dummy',
                label: {
                    x: ['-x-label', '+x-label'],
                    y: ['-y-label', '+y-label']
                },
                attributes: [{
                    id: 'attr1',
                    name: 'dummy',
                    configs: [{
                        id: 'color',
                        name: '色変更',
                        arguments: ['#fff']
                    }]
                }],
                plots: [{
                    id: 'plt1',
                    name: 'plot1',
                    created_user_id: 'guest',
                    coordinate: {
                        x: 1,
                        y: 1
                    },
                    belongs: [{
                        attribute_id: 'attr1',
                        isChecked: false
                    }]
                }],
            }, {
                id: 'prj2',
                name: 'dummy2',
                description: 'This is description for dummy', 
                label: {
                    x: ['-x-label', '+x-label'],
                    y: ['-y-label', '+y-label']
                },
                attributes: [{
                    id: 'attr2',
                    name: 'dummy2',
                    configs: [{
                        id: 'color',
                        name: '色変更',
                        arguments: ['#fff']
                    }]
                }],
                plots: [{
                    id: 'plt1',
                    name: 'plot1',
                    created_user_id: 'guest',
                    coordinate: {
                        x: 1,
                        y: 1
                    },
                    belongs: [{
                        attribute_id: 'attr2',
                        isChecked: false
                    }]
                }]
            }],
            shared_projects: [{
                shared_user_id: 'sample',
                project_id: 'prj1',
                authority: 0,
            }]
        };
    };
}
