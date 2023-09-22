import type { Meta, StoryObj } from "@storybook/react";

import PlayStopIcon from "./PlayStopIcon";

const component = PlayStopIcon;

const meta: Meta<typeof component> = {
  component,
};

type Story = StoryObj<typeof component>;

export default meta;

export const Primary: Story = {
  args: {
    playing: true,
  },
};
