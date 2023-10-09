import type { Meta, StoryObj } from "@storybook/react";

import SnapclientSettings from "./SnapclientSettings";

const component = SnapclientSettings;

const meta: Meta<typeof component> = {
  component,
};

type Story = StoryObj<typeof component>;

export default meta;

export const Primary: Story = {
  args: {
    open: true
  },
};
