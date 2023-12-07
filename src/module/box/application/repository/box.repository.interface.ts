import { Box } from '../../domain/box.entity';

export const BOX_REPOSITORY = 'BOX_REPOSITORY';

export interface IBoxRepository {
  getAllBoxes(): Promise<{ boxes: Box[]; count: number }>;

  getBoxById(id: number): Promise<Box>;

  saveBox(box: Box): Promise<Box>;

  deleteBox(box: Box): Promise<Box>;
}
