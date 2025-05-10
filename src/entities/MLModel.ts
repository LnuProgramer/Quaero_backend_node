import {
    Entity,
    PrimaryColumn,
    Column,
} from 'typeorm';

@Entity({ name: 'ml_model' })
export class MlModel {
    @PrimaryColumn()
    id!: number;

    @Column({ name: 'model_json', type: 'longtext' })
    modelJson!: string;

    @Column({ name: 'weight_bin_base64', type: 'longtext' })
    weightBinBase64!: string;


}
