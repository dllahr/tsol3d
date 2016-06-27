import argparse
import sys


class Atom(object):
	def __init__(self, index=None, symbol=None):
		self.index = index
		self.symbol = symbol
		self.atom_line = None
		self.anisou_line = None
		self.r = None
		self.dr = None

_atom_line_id = "ATOM"
_anisou_line_id = "ANISOU"

_anisou_scaling_factor = 10000.0


def build_parser():
	parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.ArgumentDefaultsHelpFormatter)
	parser.add_argument("-verbose", "-v", help="Whether to print a bunch of output.", action="store_true", default=False)
	parser.add_argument("input_file", help="input pdb file to convert to 3dmol model", type=str)
	return parser


def main(args):
	f = open(args.input_file)
	raw_lines = f.read().strip().split("\n")
	f.close()
	lines = [x.split() for x in raw_lines]

	atom_index_to_atom_obj_map = {}
	for l in lines:
		l_type = l[0]
		if l_type == _atom_line_id or l_type == _anisou_line_id:
			atom_index = int(l[1])
			atom_symbol = l[2]
			if atom_index not in atom_index_to_atom_obj_map:
				atom_index_to_atom_obj_map[atom_index] = Atom(atom_index, atom_symbol)
			atom = atom_index_to_atom_obj_map[atom_index]

			if l_type == _atom_line_id:
				atom.atom_line = l
				atom.r = [float(x) for x in l[6:9]]
			else:
				atom.anisou_line = l
				atom.dr = [float(x)/_anisou_scaling_factor for x in l[6:9]]

	atom_indexes = list(atom_index_to_atom_obj_map.keys())
	atom_indexes.sort()
	for ai in atom_indexes:
		a = atom_index_to_atom_obj_map[ai]
		output_line = [a.symbol]
		output_line.extend(a.r)
		if a.dr is not None:
			output_line.extend(a.dr)
		print "\t".join([str(x) for x in output_line])



if __name__ == "__main__":
	args = build_parser().parse_args(sys.argv[1:])

#	setup_logger.setup(verbose=args.verbose)

#	logger.debug("args:  {}".format(args))

	main(args)

