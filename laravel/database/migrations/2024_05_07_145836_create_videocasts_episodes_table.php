<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('videocast_episodes', function (Blueprint $table) {
            $table->id();
            $table->string('display_name');
            $table->string('hashed_name');
            $table->text('description')->nullable();
            $table->integer('duration')->nullable();
            $table->unsignedBigInteger('videocast_id');
            $table->foreign('videocast_id')->references('id')->on('videocasts')->onDelete('cascade');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('videocast_episodes');
    }
};
