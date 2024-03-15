import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersPasswordHistoryTables1710342349054 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL
      );
      ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE (username);
  `);

    await queryRunner.query(`
      CREATE TABLE password_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        hashed_password TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      ALTER TABLE password_history ADD CONSTRAINT password_history_user_id_fk 
      FOREIGN KEY (user_id) REFERENCES users (id);
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE password_history;
      DROP TABLE users;
  `);
  }
}
