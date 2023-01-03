import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  findAll() {
    return this.pokemonModel.find().limit(5).skip(5);
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(`pokemon don't found`);
    }

    return pokemon;
  }

  async create(data: CreatePokemonDto) {
    data.name = data.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(data);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  async update(term: string, data: UpdatePokemonDto) {
    try {
      if (data.name) data.name = data.name.toLowerCase();
      const pokemon = await this.findOne(term);
      await pokemon.updateOne(data);
      return { ...pokemon.toJSON(), ...data };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    // const result = this.pokemonModel.findByIdAndDelete(id);
    // console.log(result);

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`pokemon don't found`);
    }

    return;
  }

  private handleException(error) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `item exist in the database please made sure name and no be diferent`,
      );
    }
    console.error(error);
    throw new InternalServerErrorException(
      `can't create pokemon - check server logs`,
    );
  }
}
