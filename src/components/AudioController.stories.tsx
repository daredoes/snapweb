import type { Meta, StoryObj } from "@storybook/react";

import AudioController from "./AudioController";

const component = AudioController;

const meta: Meta<typeof component> = {
  component,
};

type Story = StoryObj<typeof component>;

export default meta;

export const Primary: Story = {
  args: {},
};
