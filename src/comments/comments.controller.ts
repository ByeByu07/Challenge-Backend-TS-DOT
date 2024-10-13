import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne(+id);
  }

  @Post()
  create(@Body() comment: Comment): Promise<Comment> {
    return this.commentsService.create(comment);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() comment: Comment): Promise<Comment> {
    return this.commentsService.update(+id, comment);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.commentsService.remove(+id);
  }
}