import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({ relations: ['post'] });
  }

  findOne(id: number): Promise<Comment> {
    // return this.commentsRepository.findOne(id, { relations: ['post'] });
    return this.commentsRepository.findOne({
      where: { id },
      relations: ['post'],
    });
  }

  create(comment: Comment): Promise<Comment> {
    return this.commentsRepository.save(comment);
  }

  async update(id: number, comment: Comment): Promise<Comment> {
    await this.commentsRepository.update(id, comment);
    return this.commentsRepository.findOne({
      where: { id },
      relations: ['post'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }
}